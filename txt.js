(function () {
    'use strict';

    var FontSizeForm = MediumEditor.extensions.form.extend({

        name: 'fontsize',
        action: 'fontSize',
        aria: 'increase/decrease font size',
        contentDefault: '&#xB1;', // ±
        contentFA: '<i class="fa fa-text-height"></i>',

        init: function () {
            MediumEditor.extensions.form.prototype.init.apply(this, arguments);
        },

        // Called when the button the toolbar is clicked
        // Overrides ButtonExtension.handleClick
        handleClick: function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (!this.isDisplayed()) {
                // Get fontsize of current selection (convert to string since IE returns this as number)
                var fontSize = this.document.queryCommandValue('fontSize') + '';
                this.showForm(fontSize);
            }

            return false;
        },

        // Called by medium-editor to append form to the toolbar
        getForm: function () {
            if (!this.form) {
                this.form = this.createForm();
            }
            return this.form;
        },

        // Used by medium-editor when the default toolbar is to be displayed
        isDisplayed: function () {
            return this.getForm().style.display === 'block';
        },

        hideForm: function () {
            this.getForm().style.display = 'none';
            this.getInput().value = '';
        },

        showForm: function (fontSize) {
            var input = this.getInput();

            this.base.saveSelection();
            this.hideToolbarDefaultActions();
            this.getForm().style.display = 'block';
            this.setToolbarPosition();

            input.value = fontSize || '';
            input.focus();
        },

        // Called by core when tearing down medium-editor (destroy)
        destroy: function () {
            if (!this.form) {
                return false;
            }

            if (this.form.parentNode) {
                this.form.parentNode.removeChild(this.form);
            }

            delete this.form;
        },

        // core methods

        doFormSave: function () {
            this.base.restoreSelection();
            this.base.checkSelection();
        },

        doFormCancel: function () {
            this.base.restoreSelection();
            this.clearFontSize();
            this.base.checkSelection();
        },

        // form creation and event handling
        createForm: function () {
            var doc = this.document,
                form = doc.createElement('div'),
                input = doc.createElement('input'),
                close = doc.createElement('a'),
                save = doc.createElement('a');

            // Font Size Form (div)
            form.className = 'medium-editor-toolbar-form';
            form.id = 'medium-editor-toolbar-form-fontsize-' + this.getEditorId();

            // Handle clicks on the form itself
            this.on(form, 'click', this.handleFormClick.bind(this));

            // Add font size slider
            input.setAttribute('type', 'range');
            input.setAttribute('min', '1');
            input.setAttribute('max', '7');
            input.className = 'medium-editor-toolbar-input';
            form.appendChild(input);

            // Handle typing in the textbox
            this.on(input, 'change', this.handleSliderChange.bind(this));

            // Add save buton
            save.setAttribute('href', '#');
            save.className = 'medium-editor-toobar-save';
            save.innerHTML = this.getEditorOption('buttonLabels') === 'fontawesome' ?
                             '<i class="fa fa-check"></i>' :
                             '&#10003;';
            form.appendChild(save);

            // Handle save button clicks (capture)
            this.on(save, 'click', this.handleSaveClick.bind(this), true);

            // Add close button
            close.setAttribute('href', '#');
            close.className = 'medium-editor-toobar-close';
            close.innerHTML = this.getEditorOption('buttonLabels') === 'fontawesome' ?
                              '<i class="fa fa-times"></i>' :
                              '&times;';
            form.appendChild(close);

            // Handle close button clicks
            this.on(close, 'click', this.handleCloseClick.bind(this));

            return form;
        },

        getInput: function () {
            return this.getForm().querySelector('input.medium-editor-toolbar-input');
        },

        clearFontSize: function () {
            MediumEditor.selection.getSelectedElements(this.document).forEach(function (el) {
                if (el.nodeName.toLowerCase() === 'font' && el.hasAttribute('size')) {
                    el.removeAttribute('size');
                }
            });
        },

        handleSliderChange: function () {
            var size = this.getInput().value;
            if (size === '4') {
                this.clearFontSize();
            } else {
                this.execAction('fontSize', { value: size });
            }
        },

        handleFormClick: function (event) {
            // make sure not to hide form when clicking inside the form
            event.stopPropagation();
        },

        handleSaveClick: function (event) {
            // Clicking Save -> create the font size
            event.preventDefault();
            this.doFormSave();
        },

        handleCloseClick: function (event) {
            // Click Close -> close the form
            event.preventDefault();
            this.doFormCancel();
        }
    });

    MediumEditor.extensions.fontSize = FontSizeForm;
}());
(function () {
    'use strict';

    var FontNameForm = MediumEditor.extensions.form.extend({

        name: 'fontname',
        action: 'fontName',
        aria: 'change font name',
        contentDefault: '&#xB1;', // ±
        contentFA: '<i class="fa fa-font"></i>',

        fonts: ['', 'Arial', 'Verdana', 'Times New Roman'],

        init: function () {
            MediumEditor.extensions.form.prototype.init.apply(this, arguments);
        },

        // Called when the button the toolbar is clicked
        // Overrides ButtonExtension.handleClick
        handleClick: function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (!this.isDisplayed()) {
                // Get FontName of current selection (convert to string since IE returns this as number)
                var fontName = this.document.queryCommandValue('fontName') + '';
                this.showForm(fontName);
            }

            return false;
        },

        // Called by medium-editor to append form to the toolbar
        getForm: function () {
            if (!this.form) {
                this.form = this.createForm();
            }
            return this.form;
        },

        // Used by medium-editor when the default toolbar is to be displayed
        isDisplayed: function () {
            return this.getForm().style.display === 'block';
        },

        hideForm: function () {
            this.getForm().style.display = 'none';
            this.getSelect().value = '';
        },

        showForm: function (fontName) {
            var select = this.getSelect();

            this.base.saveSelection();
            this.hideToolbarDefaultActions();
            this.getForm().style.display = 'block';
            this.setToolbarPosition();

            select.value = fontName || '';
            select.focus();
        },

        // Called by core when tearing down medium-editor (destroy)
        destroy: function () {
            if (!this.form) {
                return false;
            }

            if (this.form.parentNode) {
                this.form.parentNode.removeChild(this.form);
            }

            delete this.form;
        },

        // core methods

        doFormSave: function () {
            this.base.restoreSelection();
            this.base.checkSelection();
        },

        doFormCancel: function () {
            this.base.restoreSelection();
            this.clearFontName();
            this.base.checkSelection();
        },

        // form creation and event handling
        createForm: function () {
            var doc = this.document,
                form = doc.createElement('div'),
                select = doc.createElement('select'),
                close = doc.createElement('a'),
                save = doc.createElement('a'),
                option;

            // Font Name Form (div)
            form.className = 'medium-editor-toolbar-form';
            form.id = 'medium-editor-toolbar-form-fontname-' + this.getEditorId();

            // Handle clicks on the form itself
            this.on(form, 'click', this.handleFormClick.bind(this));

            // Add font names
            for (var i = 0; i<this.fonts.length; i++) {
                option = doc.createElement('option');
                option.innerHTML = this.fonts[i];
                option.value = this.fonts[i];
                select.appendChild(option);
            }

            select.className = 'medium-editor-toolbar-select';
            form.appendChild(select);

            // Handle typing in the textbox
            this.on(select, 'change', this.handleFontChange.bind(this));

            // Add save buton
            save.setAttribute('href', '#');
            save.className = 'medium-editor-toobar-save';
            save.innerHTML = this.getEditorOption('buttonLabels') === 'fontawesome' ?
                             '<i class="fa fa-check"></i>' :
                             '&#10003;';
            form.appendChild(save);

            // Handle save button clicks (capture)
            this.on(save, 'click', this.handleSaveClick.bind(this), true);

            // Add close button
            close.setAttribute('href', '#');
            close.className = 'medium-editor-toobar-close';
            close.innerHTML = this.getEditorOption('buttonLabels') === 'fontawesome' ?
                              '<i class="fa fa-times"></i>' :
                              '&times;';
            form.appendChild(close);

            // Handle close button clicks
            this.on(close, 'click', this.handleCloseClick.bind(this));

            return form;
        },

        getSelect: function () {
            return this.getForm().querySelector('select.medium-editor-toolbar-select');
        },

        clearFontName: function () {
            MediumEditor.selection.getSelectedElements(this.document).forEach(function (el) {
                if (el.nodeName.toLowerCase() === 'font' && el.hasAttribute('face')) {
                    el.removeAttribute('face');
                }
            });
        },

        handleFontChange: function () {
            var font = this.getSelect().value;
            if (font === '') {
                this.clearFontName();
            } else {
                this.execAction('fontName', { value: font });
            }
        },

        handleFormClick: function (event) {
            // make sure not to hide form when clicking inside the form
            event.stopPropagation();
        },

        handleSaveClick: function (event) {
            // Clicking Save -> create the font size
            event.preventDefault();
            this.doFormSave();
        },

        handleCloseClick: function (event) {
            // Click Close -> close the form
            event.preventDefault();
            this.doFormCancel();
        }
    });

    MediumEditor.extensions.fontName = FontNameForm;
}());




var currentTextSelection;

/**
* Gets the color of the current text selection
*/
function getCurrentTextColor(){
    return $(editor.getSelectedParentElement()).css('color');
}

/**
 * Custom `color picker` extension
 */
var ColorPickerExtension = MediumEditor.extensions.button.extend({
    name: "colorPicker",
    action: "applyForeColor",
    aria: "color picker",
    contentDefault: "<span class='editor-color-picker'>Text Color<span>",

    init: function() {
        this.button = this.document.createElement('button');
        this.button.classList.add('medium-editor-action');
        this.button.innerHTML = '<b>Text color</b>';
        
        //init spectrum color picker for this button
        initPicker(this.button);
        
        //use our own handleClick instead of the default one
        this.on(this.button, 'click', this.handleClick.bind(this));
    },
     handleClick: function (event) {
         //keeping record of the current text selection
         currentTextSelection = editor.exportSelection();
         
         //sets the color of the current selection on the color picker
         $(this.button).spectrum("set", getCurrentTextColor());

         //from here on, it was taken form the default handleClick
         event.preventDefault();
         event.stopPropagation();

         var action = this.getAction();

         if (action) {
             this.execAction(action);
         }
     }
});

var pickerExtension = new ColorPickerExtension();

function setColor(color) {
    var finalColor = color ? color.toRgbString() : 'rgba(0,0,0,0)';

    pickerExtension.base.importSelection(currentTextSelection);
    pickerExtension.document.execCommand("styleWithCSS", false, true);
    pickerExtension.document.execCommand("foreColor", false, finalColor);
}

function initPicker(element) {
    $(element).spectrum({
        allowEmpty: true,
        color: "#f00",
        showInput: true,
        showAlpha: true,
        showPalette: true,
        showInitial: true,
        hideAfterPaletteSelect: true,
        preferredFormat: "hex3",
        change: function(color) {
            setColor(color);
        },
        hide: function(color) {
            setColor(color);
        },
        palette: [
            ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
            ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
            ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
            ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
            ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
            ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
            ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
            ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
        ]
    });
}








/*var html = document.querySelector(".html");*/
var  editableText = document.querySelector(".editable");
var editor = new MediumEditor('.editable', {
  placeholder:{
        text: 'Yaz',
        hideOnClick: true
    },
  buttonLabels: false,
  imageDragging: false,

  toolbar: {
    buttons: ['fontsize','fontname','colorPicker','bold', 'italic', 'underline', 'quote']
  },    
  extensions: {
        'colorPicker': pickerExtension

    }
}).subscribe("editableClick", function(e){

transformStore.text.removeEvent('drag');
d3.select('.medium-editor-element').classed('area-style',true);
d3.select('.medium-editor-element').node().focus();
});




// $('.medium-editor-element').click()

// setTimeout(function(){
// t.addEvent('drag','default');
// },6000);


/*.subscribe("editableInput", function() {
  html.value = editableText.innerHTML;
});

html.onkeyup = html.ontouchend = function() {
  editableText.innerHTML = html.value;
};
editableText.innerHTML = html.value*/