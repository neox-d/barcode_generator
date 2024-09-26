frappe.ui.form.on('Delivery Note', {

    
    refresh: function(frm) {


    function addScannerIconToField(field) {
        if (!field.$scanner_icon_appended) {
            field.$scanner_icon_appended = true;


            // var $scannerIcon = $('<span class="scanner-icon" style="cursor: pointer; position: absolute; right: 5px; top: 50%; transform: translateY(-50%); font-size: 15px; width: 18px; height: 18px; line-height: 18px; text-align: center; border-radius: 50%; background-color: var(--disabled-text-color); color: #1C2126;">&#128247;</span>')
            var $icon = $('<span class="link-btn" style="display: inline;"><a class="btn-open no-decoration" title="Scan"><svg class="icon  icon-sm" style="" aria-hidden="true"><use class="" href="#icon-scan"></use></svg></a></span>');
            field.$input.parent().css('position', 'relative'); 
            field.$input.css('position', 'relative'); 
            field.$input.after($icon);


            $icon.on('click', function() {
                // frm.set_value(field.df.fieldname, '');
                
                const scanner = new frappe.ui.Scanner({
                        dialog: true, // open camera scanner in a dialog
                        multiple: false, // stop after scanning one value
                        on_scan(data) {
                                    console.log(sessionStorage.getItem(data.decodedText) === null);
    
    if (sessionStorage.getItem(data.decodedText) === null) {
        
      //  sessionStorage.setItem(frm.doc.custom_barcode_scanner, frm.doc.custom_barcode_scanner);
    
    frappe.call({
        method: "barcode_generator.barcode_generator.doctype.master_barcode_generator.master_barcode_generator.get_items",
        args: {
            'qr_number': data.decodedText,
        },
        callback: function (r) {
            var data = r.message;
            console.log(data);
            if (data.length == 2) { // Individual barcode
                
                let item_code = [];
                let serial_nos = '';
                
                if (!is_null(frm.doc.items)) {
                    
                    frm.doc.items.forEach((row) => {
                        item_code.push(row.item_code);
                        serial_nos += row.serial_no
                    })
                }
                
                console.log(serial_nos);
                
                if (item_code.includes(data[0][0].item_code)) {
                    
                    let index = item_code.indexOf(data[0][0].item_code);
                    
                    console.log(serial_nos.search(data[0][0].serial_no));
                    if (serial_nos.search(data[0][0].serial_no) == -1) {
                        console.log('All Ok');
                        frm.doc.items[index].qty += 1;
                        frm.doc.items[index].serial_no += '\n'
                        frm.doc.items[index].serial_no += data[0][0].serial_no;
                    } else {
                        frappe.show_alert({
                            message:__('Item already added'),
                            indicator:'red'
                        }, 5);
                    }
                    
                    frm.refresh_field('items');
                    
                } else {
                    
                    var child_create1 = frm.add_child("items");
                    console.log(child_create1);
                    console.log(sessionStorage.getItem(child_create1.name))
                    child_create1.item_code = data[0][0].item_code;
                    
                    
                    child_create1.use_serial_batch_fields = 1
                    child_create1.serial_no = data[0][0].serial_no;
                    child_create1.qty = 1;
                    child_create1.item_name = data[0][0]['item_name'];
                    child_create1.uom = data[1][0]['stock_uom'];

                    if (frm.doc.items[0].qty == 0) {
                        frm.doc.items.splice(0, 1);
                        child_create.idx = 1
                    }
                    
                    sessionStorage.setItem(data.decodedText, child_create1.name);
                    frm.refresh_field('items');
                    
                }
                

            } else { // Master Barcode (QR)
            
                // frm.set_value("items", 0)
                let item_code1 = [];
                let serial_nos1 = '';
                
                if (!is_null(frm.doc.items)) {
                    
                    frm.doc.items.forEach((row) => {
                        item_code1.push(row.item_code);
                        serial_nos1 += row.serial_no
                    })
                }
                
                console.log(serial_nos1);
                
                var serial_no = ""
                        data[0].forEach(function (obj) {
                            serial_no += obj['serial_no']
                            serial_no += "\n"
                        })
                        
                console.log(serial_no);
                    
                if (item_code1.includes(data[1][0].item_code)) {
                    
                    let index = item_code1.indexOf(data[1][0].item_code);
                    
                    console.log(serial_nos1.search(data[0][0].serial_no));
                    if (serial_nos1.search(data[0][0].serial_no) == -1) {
                        console.log('All Ok');
                        frm.doc.items[index].qty += data[0].length;
                        frm.doc.items[index].serial_no += '\n'
                        frm.doc.items[index].serial_no += serial_no;
                    } else {
                        frappe.show_alert({
                            message:__('Item already added'),
                            indicator:'red'
                        }, 5);
                    }
                    
                    frm.refresh_field('items');
                    
                    
                } else {
                    
                    var child_create = frm.add_child("items");
                    console.log(child_create);
                    
                    console.log(sessionStorage.getItem(child_create.name))
                    child_create.item_code = data[1][0].item_code
                    
                    child_create.use_serial_batch_fields = 1
                    child_create.serial_no = serial_no;
                    child_create.qty = data[0].length;
                    child_create.item_name = data[0][0]['item_name'];
                    child_create.uom = data[2][0]['stock_uom'];

                    if (frm.doc.items[0].qty == 0) {
                        frm.doc.items.splice(0, 1);
                        child_create.idx = 1
                    }
                    
                    sessionStorage.setItem(data.decodedText, child_create.name);
                    
                    frm.refresh_field('items');
                }

            }

        },
    });
    } else {
        frappe.msgprint({
        title: __('Warning'),
        indicator: 'red',
        message: __('Barcode already scanned')
    });
    }
                        }
                    });
            });
        }
    }

    $.each(frm.fields_dict, function(fieldname, field) {
        if (fieldname === 'custom_barcode_scanner') {
            addScannerIconToField(field);
        }
    });
    }
});

frappe.ui.form.on('Delivery Note', {

setup(frm) {
    
    sessionStorage.clear();
    
}

});

frappe.ui.form.on('Delivery Note', {

custom_barcode_scanner(frm) {
    // your code here
    
    console.log(sessionStorage.getItem(frm.doc.custom_barcode_scanner) === null);
    
    if (sessionStorage.getItem(frm.doc.custom_barcode_scanner) === null) {
        
      //  sessionStorage.setItem(frm.doc.custom_barcode_scanner, frm.doc.custom_barcode_scanner);
    
    frappe.call({
        method: "barcode_generator.barcode_generator.doctype.master_barcode_generator.master_barcode_generator.get_items",
        args: {
            'qr_number': frm.doc.custom_barcode_scanner,
        },
        callback: function (r) {
            var data = r.message;
            console.log(data);
            if (data.length == 2) { // Individual barcode
                
                let item_code = [];
                let serial_nos = '';
                
                if (!is_null(frm.doc.items)) {
                    
                    frm.doc.items.forEach((row) => {
                        item_code.push(row.item_code);
                        serial_nos += row.serial_no
                    })
                }
                
                console.log(serial_nos);
                
                if (item_code.includes(data[0][0].item_code)) {
                    
                    let index = item_code.indexOf(data[0][0].item_code);
                    
                    console.log(serial_nos.search(data[0][0].serial_no));
                    if (serial_nos.search(data[0][0].serial_no) == -1) {
                        console.log('All Ok');
                        frm.doc.items[index].qty += 1;
                        frm.doc.items[index].serial_no += '\n'
                        frm.doc.items[index].serial_no += data[0][0].serial_no;
                    } else {
                        frappe.show_alert({
                            message:__('Item already added'),
                            indicator:'red'
                        }, 5);
                    }
                    
                    frm.refresh_field('items');
                    
                } else {
                    
                    var child_create1 = frm.add_child("items");
                    console.log(child_create1);
                    console.log(sessionStorage.getItem(child_create1.name))
                    child_create1.item_code = data[0][0].item_code;
                    
                    
                    child_create1.use_serial_batch_fields = 1
                    child_create1.serial_no = data[0][0].serial_no;
                    child_create1.qty = 1;
                    child_create1.item_name = data[0][0]['item_name'];
                    child_create1.uom = data[1][0]['stock_uom'];

                    console.log(child_create1);

                    if (frm.doc.items[0].qty == 0) {
                        frm.doc.items.splice(0, 1);
                        child_create.idx = 1
                    }
                    
                    sessionStorage.setItem(frm.doc.custom_barcode_scanner, child_create1.name);
                    frm.refresh_field('items');
                    
                }
                

            } else { // Master Barcode (QR)
            
                // frm.set_value("items", 0)
                let item_code1 = [];
                let serial_nos1 = '';
                
                if (!is_null(frm.doc.items)) {
                    
                    frm.doc.items.forEach((row) => {
                        item_code1.push(row.item_code);
                        serial_nos1 += row.serial_no
                    })
                }
                
                console.log(serial_nos1);
                
                var serial_no = ""
                        data[0].forEach(function (obj) {
                            serial_no += obj['serial_no']
                            serial_no += "\n"
                        })
                        
                console.log(serial_no);
                    
                if (item_code1.includes(data[1][0].item_code)) {
                    
                    let index = item_code1.indexOf(data[1][0].item_code);
                    
                    console.log(serial_nos1.search(data[0][0].serial_no));
                    if (serial_nos1.search(data[0][0].serial_no) == -1) {
                        console.log('All Ok');
                        frm.doc.items[index].qty += data[0].length;
                        frm.doc.items[index].serial_no += '\n'
                        frm.doc.items[index].serial_no += serial_no;
                    } else {
                        frappe.show_alert({
                            message:__('Item already added'),
                            indicator:'red'
                        }, 5);
                    }
                    
                    frm.refresh_field('items');
                    
                    
                } else {
                    
                    var child_create = frm.add_child("items");
                    console.log(child_create);
                    
                    console.log(sessionStorage.getItem(child_create.name))
                    child_create.item_code = data[1][0].item_code
                    
                    child_create.use_serial_batch_fields = 1
                    child_create.serial_no = serial_no;
                    child_create.qty = data[0].length;
                    child_create.item_name = data[0][0]['item_name'];
                    child_create.uom = data[2][0]['stock_uom'];


                    if (frm.doc.items[0].qty == 0) {
                        frm.doc.items.splice(0, 1);
                        child_create.idx = 1
                    }
                    
                    sessionStorage.setItem(frm.doc.custom_barcode_scanner, child_create.name);
                    
                    frm.refresh_field('items');
                }

            }

        },
    });
    } else {
        frappe.msgprint({
        title: __('Warning'),
        indicator: 'red',
        message: __('Barcode already scanned')
    });
    }

}
});

frappe.ui.form.on('Delivery Note Item', {

items_add(frm, cdt, cdn) {
    console.log(cdn);
    sessionStorage.setItem(frm.doc.custom_barcode_scanner, cdn);
},

items_remove(frm, cdt, cdn) {
    console.log(cdn);
    sessionStorage.removeItem(frm.doc.custom_barcode_scanner, cdn);
}
})
