// Copyright (c) 2024, Sanskar Technolab and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Master Barcode Generator", {
// 	refresh(frm) {

// 	},
// });
frappe.ui.form.on("Master Barcode Generator", {
    get_serial_no(frm) {
        frappe.call({
            method: "barcode_generator.barcode_generator.doctype.master_barcode_generator.master_barcode_generator.get_serial_no",
            args: {
                item_code: frm.doc.item_code,
                limit: frm.doc.qty
            },
            callback: function (r) {
                var serialNumbers = r.message;
                console.log(serialNumbers.length)
                if (serialNumbers.length != frm.doc.qty) {
                    
                    frm.set_value("master_barcode_details", 0)
                    frappe.msgprint("Requested Serial No: " + frm.doc.qty + ". Available Serial Nos: " + serialNumbers.length + ". Please adjust the requested quantity for generating barcodes accordingly.")
                    frm.set_value("qty", undefined)
                }
                else{
                    frm.set_value("master_barcode_details", 0)
                    serialNumbers.forEach(function (obj) {
                        var child_create = frm.add_child("master_barcode_details");
                        child_create.serial_no = obj['name'];
                        child_create.item_name = obj['item_name'];
                    })
                }
            },
        });
    },
    on_submit: function (frm) {
        frappe.call({
            method: "barcode_generator.barcode_generator.doctype.master_barcode_generator.master_barcode_generator.set_status",
            args: {
                nm: frm.doc.master_barcode_details
            }
        })
    },
    after_cancel: function (frm) {
        frappe.call({
            method: "barcode_generator.barcode_generator.doctype.master_barcode_generator.master_barcode_generator.set_status_untick",
            args: {
                nm: frm.doc.master_barcode_details
            }
        })
    },
    onload:function(frm){
        cur_frm.set_query("item_code", function() {
            return {
                "filters": {
                    "has_serial_no": 1,
                    // "name": ["not in", "Services"],
                }
            };
        });
    }
});