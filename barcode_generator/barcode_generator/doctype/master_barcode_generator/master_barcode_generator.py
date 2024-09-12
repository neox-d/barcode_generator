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
