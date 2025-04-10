// Load saved theme or set default to "dark"
let globalTheme = app.LoadText("mode", "", "fileMN") || "dark";

// Function to set the layout theme
const setLayoutTheme = (newTheme) => {
    globalTheme = newTheme;
    app.SaveText("mode", globalTheme, "fileMN");
    f7App.setDarkMode(newTheme !== "light"); 
    f7ToggleBackColor();
    setTimeout(()=> app.SetNavBarColor(newTheme == "light"?"#ffffff":"#1b1c1e" ), 0)
};

// Toggle between light and dark mode
const toggleMode = () => setLayoutTheme(globalTheme === "light" ? "dark" : "light");

// Function to load and display the note list
const loadNoteList = () => {
    let listContainer = $$("#noteList");

    if (notes.length > 0) listContainer.empty();

    notes.forEach((note, index) => {
        const date = note.date ? formatDate(note.date) : "Unknown date";

        listContainer.prepend(`
            <li>
                <a href="/edit/${index}/" data-transition="f7-parallax" class="item-link item-content taphold" data-id="${index}">
                    <div class="item-inner">
                        ${note.title.length > 0 ? `<div class="item-title">${note.title}</div>` : ""}
                        <div class="note-content" style="${note.title.length > 0 ? 'opacity:.8;font-size:14px;font-weight:400' : 'font-size:16px;font-weight:500'}">
                            ${note.content}
                        </div>
                        <small style="opacity:.5;font-weight:300">${date}</small>
                    </div>
                </a>
            </li>
        `);
    });

    if (listContainer.children("li").length === 0) {
        listContainer.append(`
            <li class="item-content">
                <div class="item-inner">
                    <div class="item-title">No notes available</div>
                </div>
            </li>
        `);
    }
};

// Function to load the note editor
const loadNoteEditor = (noteId) => {
    let titleInput = $$("#noteTitle");
    let contentInput = $$("#noteContent");

    if (noteId !== undefined && noteId !== "new") {
        let note = notes[noteId];
        titleInput.val(note.title);
        contentInput.val(note.content);
    } else {
        titleInput.val("");
        contentInput.val("");
    }

    // Save button functionality
    $$("#saveNote").click(() => {
        let tVal = titleInput.val().replaceAll('"', '\\"').trim();
        let cVal = contentInput.val().replaceAll('"', '\\"').trim();

        if (tVal.length > 0 || cVal.length > 0) {
            let newNote = {
                title: tVal,
                content: cVal,
                date: new Date().toISOString(),
            };

            if (noteId !== undefined && noteId !== "new") {
                notes[noteId] = newNote;
            } else {
                notes.push(newNote);
            }

            saveNotes();

            // Give time to close keyboard before navigating back
            setTimeout(() => f7View.router.back(), 100);
        }
    });
};

// Load and save notes functions
const loadNotes = () => {
    let data = app.LoadText("notes", "", "file");

    return data.length === 0 ? [] : JSON.parse(data);
};

const saveNotes = () => {
    app.SaveText("notes", JSON.stringify(notes), "file");
};

// Function to format date
function formatDate(dateString) {
    const now = new Date();
    const noteDate = new Date(dateString);
    const diffMs = now - noteDate;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins === 0) {
        return "Just now";
    } else if (diffMins < 60) {
        return `${diffMins} min ago`;
    }

    const isToday = now.toDateString() === noteDate.toDateString();
    if (isToday) {
        return new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(noteDate);
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(noteDate);
}

// Load notes initially
let notes = loadNotes();

// Handle long-press (taphold) event for deleting notes
$$(document).on("taphold", ".taphold", function () {
    let id = $$(this).attr("data-id");

    f7App.dialog.confirm("This cannot be undone", "Delete note", function () {
        notes.splice(id, 1);
        loadNoteList();
        saveNotes();
    });
});

// Load note list when home page is opened
$$(document).on("page:afterin", '.page[data-name="home"]', () => {
    loadNoteList();
});

// Load note editor when edit page is initialized
$$(document).on("page:init", '.page[data-name="edit"]', (e, page) => {
    loadNoteEditor(page.route.params.id);
});

// Show About dialog
const showAbout = () => {
    $f7 = Framework7.instance;
    $f7.dialog.alert("A Demo app, made using F7Wrapper Plugin. -- Created by Distino", "About MyNotes");
};

// Expose functions to the global scope
globalThis.setLayoutTheme = setLayoutTheme;
globalThis.toggleMode = toggleMode;
globalThis.showAbout = showAbout;