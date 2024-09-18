# Copyright (c) 2024, Sanskar Technolab and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import json


class MasterBarcodeGenerator(Document):
	pass

@frappe.whitelist()
def get_serial_no(item_code, limit):
    data = frappe.db.sql("""
			SELECT name, item_name 
			FROM `tabSerial No` 
			WHERE item_code = %s 
			AND custom_barcode_generator = 0 
			AND status = "Active"
			ORDER BY name ASC
			LIMIT {}
		""".format(limit), (item_code), as_dict=True)
                
    return data


@frappe.whitelist()
def set_status(nm):
	data=frappe.json.loads(nm)
	for i in data:
		print(i)
		
		frappe.db.set_value("Serial No",i['serial_no'],"custom_barcode_generator",1)

@frappe.whitelist()
def set_status_untick(nm):
	data=frappe.json.loads(nm)
	for i in data:
		frappe.db.set_value("Serial No",i['serial_no'],"custom_barcode_generator",0)


@frappe.whitelist()
@frappe.whitelist()
def get_items(qr_number):
	
	item_code = frappe.db.get_all("Master Barcode Generator", filters={'name': qr_number}, fields=['item_code'])
	
	if (item_code):
		stock_uom = frappe.db.get_all("Item", filters={'item_code': item_code[0].item_code }, fields=['stock_uom'])
		data = frappe.db.get_all("Master Barcode Details", filters={'parent': qr_number }, fields=['item_name', 'serial_no'], order_by='modified desc')
		return [data, item_code, stock_uom]
	
	else:
		serial_no = frappe.db.get_all("Serial No", filters={'name': qr_number}, fields=['serial_no', 'custom_barcode_generator', 'item_code', 'item_name', 'status'])
		if (serial_no):
			if (serial_no[0]['custom_barcode_generator'] == 1):
						stock_uom = frappe.db.get_all("Item", filters={'item_code': serial_no[0]['item_code'] }, fields=['stock_uom'])
						return [serial_no, stock_uom]
			frappe.msgprint("Yaay! Item found")
			
		else:
			frappe.msgprint("Scanned item not found")
