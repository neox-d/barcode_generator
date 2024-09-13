// Copyright (c) 2024, Sanskar Technolab and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Bar-code Generator", {
// 	refresh(frm) {

// 	},
// });
frappe.ui.form.on("Bar-code Generator", {
    get_serial_no(frm) {
        frappe.call({
            method: "barcode_generator.barcode_generator.doctype.bar_code_generator.bar_code_generator.get_serial_no",
            args: {
                item_code: frm.doc.item_code,
                limit: frm.doc.number_of_barcode
            },
            callback: function (r) {
                var serialNumbers = r.message;
                console.log(serialNumbers)
                if (serialNumbers.length != frm.doc.number_of_barcode) {
                    frm.set_value("details", 0)
                    frappe.msgprint("Requested Serial No: " + frm.doc.number_of_barcode + ". Available Serial Nos: " + serialNumbers.length + ". Please adjust the requested quantity for generating barcodes accordingly.")
                    frm.set_value("number_of_barcode", undefined)
                }
                else {
                    frm.set_value("details", 0)
                    serialNumbers.forEach(function (obj) {
                        var child_create = frm.add_child("details");
                        child_create.serial_no = obj['name'];
                        child_create.item_name = obj['item_name'];
                    })
                }
            },
        });
    },
    on_submit: function (frm) {
        frappe.call({
            method: "barcode_generator.barcode_generator.doctype.bar_code_generator.bar_code_generator.set_status",
            args: {
                nm: frm.doc.details
            }
        })
    },
    after_cancel: function (frm) {
        frappe.call({
            method: "barcode_generator.barcode_generator.doctype.bar_code_generator.bar_code_generator.set_status_untick",
            args: {
                nm: frm.doc.details
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