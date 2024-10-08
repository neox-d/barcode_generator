import frappe
from frappe import _
BarcodeScanResult = dict[str, str | None]

@frappe.whitelist()
def get_barcode_data(search_value: str) -> BarcodeScanResult:
    
    # return search_value
	def set_cache(data: BarcodeScanResult):
		frappe.cache().set_value(f"erpnext:barcode_scan:{search_value}", data, expires_in_sec=120)

	def get_cache() -> BarcodeScanResult | None:
		if data := frappe.cache().get_value(f"erpnext:barcode_scan:{search_value}"):
			return data

	if scan_data := get_cache():
		return scan_data

	# search barcode no
	barcode_data = frappe.db.get_value(
		"Item Barcode",
		{"barcode": search_value},
		["barcode", "parent as item_code", "uom"],
		as_dict=True,
	)
	if barcode_data:
		_update_item_info(barcode_data)
		set_cache(barcode_data)
		return barcode_data

	# search serial no
	serial_no_data = frappe.db.get_value(
		"Serial No",
		search_value,
		["name as serial_no", "item_code", "batch_no"],
		as_dict=True,
	)
	if serial_no_data:
		_update_item_info(serial_no_data)
		set_cache(serial_no_data)
		return serial_no_data


	# search qr no
	qr_no_data = frappe.db.get_all(
		"Master Barcode Details",
		filters={"parent": search_value},
		fields=["serial_no", "item_name"],
		# order_by='idx asc'
		# as_list=True,
	)
	# return qr_no_data

	if qr_no_data:
		qr_item_code = frappe.db.get_value(
			"Item",
			qr_no_data[-1].get("item_name"),
			["item_code"],
			as_dict=True,
		)	
		# return qr_item_code

	if qr_no_data and qr_item_code:
		serial_nos = ''
		for item in qr_no_data:
			item.pop('item_name')
			item.update(qr_item_code)
			serial_nos += item.get('serial_no') + '\n'

		serial_nos = serial_nos[:-1]

		item = dict()
		item.update({'item_code': qr_item_code['item_code'], 'serial_no': serial_nos })

		_update_item_info(item)
		set_cache(item)
		
		return item


	# search batch no
	batch_no_data = frappe.db.get_value(
		"Batch",
		search_value,
		["name as batch_no", "item as item_code"],
		as_dict=True,
	)
	if batch_no_data:
		if frappe.get_cached_value("Item", batch_no_data.item_code, "has_serial_no"):
			frappe.throw(
				_(
					"Batch No {0} is linked with Item {1} which has serial no. Please scan serial no instead."
				).format(search_value, batch_no_data.item_code)
			)

		_update_item_info(batch_no_data)
		set_cache(batch_no_data)
		return batch_no_data

	return {}

def _update_item_info(scan_result: dict[str, str | None]) -> dict[str, str | None]:
	if item_code := scan_result.get("item_code"):
		if item_info := frappe.get_cached_value(
			"Item",
			item_code,
			["has_batch_no", "has_serial_no"],
			as_dict=True,
		):
			scan_result.update(item_info)
	return scan_result