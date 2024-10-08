frappe.ui.form.on('Delivery Note', {

    custom_barcode_scanner(frm) {

        const scanner = new erpnext.utils.BarcodeScanner({
            frm: frm,                                    // The form to operate on
            scan_field_name: "custom_barcode_scanner",   // The field where scanned data will be input
            // barcode_field: "",    // Store barcode in this field
            // serial_no_field: "serial_number",         // Store serial numbers here
            // batch_no_field: "batch_code",             // Store batch numbers here
            // uom_field: "item_uom",                    // Store unit of measure here
            // qty_field: "item_quantity",               // Store quantity here
            // max_qty_field: "max_allowed_qty",         // Max quantity allowed
            // dont_allow_new_row: true,                 // Do not add a new row for new items
            prompt_qty: false,                                // Don't prompt for quantity; auto-increment
            items_table_name: "items",   // Custom name of the items table
            // success_sound: "success_tone.mp3",        // Sound to play on success
            // fail_sound: "error_tone.mp3",             // Sound to play on failure
            scan_api: "barcode_generator.api.get_barcode_data"  // Custom API endpoint for scanning
        });

        // const input = scanner.scan_barcode_field.value;
		// 	scanner.scan_barcode_field.set_value("");
		// 	if (!input) {
		// 		return;
		// 	}   

        // function scan_api_call(input, callback) {
        //     frappe
        //         .call({
        //             method: scanner.scan_api,
        //             args: {
        //                 search_value: input,
        //             },
        //         })
        //         .then((r) => {
        //             // callback(r);
        //             console.log(r.message);
        //         });
        // }

        scanner.process_scan();
        // scan_api_call(input)
        
    }

});

