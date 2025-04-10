const loadList = () => {
    let scanList = loadHistory(); 
    
    try {
        if(scanList.length > 0) {
            $$("#history").empty();
            
            scanList.forEach((e, index) => {
                // Assuming each element is an object with 'text' property based on scan.html
                $$("#history").append(`
                    <li>
                        <a onclick="showDialog(${index})" data-id="${index}" class="taphold display-flex align-items-center">
                            <span class="truncate">${e.text}</span>
                        </a>
                    </li>
                `);
            });
        } else {
            $$("#history").empty();
            $$("#history").append(`<li><a href="/scan" data-transition="f7-parallax">You have no scan history</a></li>`);
        }
    } catch(ee) {
        alert(ee);
    }
}

$$(document).on("page:mounted", '.page[data-name="home"]', () => loadList()); 

$$(document).on("taphold", ".taphold", function() {
    try {
        let scanList = loadHistory();
        let id = Number($$(this).attr("data-id"));
        
        f7App.dialog.confirm("This cannot be undone", "Delete", function() {
            scanList.splice(id, 1);
            app.SaveText("history", JSON.stringify(scanList), "qrcsFile");
            loadList();
        });
    } catch(w) {
        alert(w);
    }
});

const showDialog = (index) => {
    let scanList = loadHistory();
    f7App.dialog.create({  
        title: "Copy text",
        text: scanList[index].text,
        buttons: [{text: "Copy", bold: true, keyCodes: [13]}],
        onClick(dialog, i) {
            if(i === 0) {
                app.SetClipboardText(scanList[index].text);
                app.ShowPopup("Copied");
            }
        },
        destroyOnClose: true,
    }).open();
};

const loadHistory = () => {
    let data = app.LoadText("history", "", "qrcsFile");
    return data.length === 0 ? [] : JSON.parse(data);
};

const saveHistory = (list) => { 
    app.SaveText("history", JSON.stringify(list), "qrcsFile");
};

window.scanList = loadHistory();
window.loadList = loadList;
window.showDialog = showDialog;
window.saveHistory = saveHistory;
window.loadHistory = loadHistory;