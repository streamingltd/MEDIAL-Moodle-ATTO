YUI.add('moodle-atto_helixatto-button', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_helixatto
 * @copyright  COPYRIGHTINFO
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_helixatto-button
 */

/**
 * Atto text editor helixatto plugin.
 *
 * @namespace M.atto_helixatto
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

var COMPONENTNAME = 'atto_helixatto';
//var LOGNAME = 'atto_helixatto';


var TEMPLATE = '' +
    '<form class=\"atto_form\">' +
        '<div id="{{elementid}}_{{innerform}}" class="mdl-align" style=\"height:{{height}}px;\">'+
            '<iframe id=\"medialiframe\" style=\"border:0px;margin:0px;background:#ffffff;width:100%;height:100%\" src=\"{{iframesrc}}\" allow=\"{{allow}}\"></iframe>' +
            '<button id=\"medial_insert\" class=\"{{CSS.INPUTSUBMIT}}\">{{get_string "insert" component}}</button>' +
        '</div>' +
    '</form>';


var CSS = {
        INPUTSUBMIT: 'atto_media_urlentrysubmit',
        INPUTCANCEL: 'atto_media_urlentrycancel'
    };

var preid = -1;
var inserted = false;
var hmlLaunchURL = '';
var ltiurl = '';
var interval = null;
var buttonInstance = '';
var dialogueInstance = null;

var dwidth = 935;
var dheight = 435;

var gotIn = false;

var oauthConsumerKey = "";

Y.namespace('M.atto_helixatto').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

  
	/**
     * Initialize the button
     *
     * @method Initializer
     */
    initializer: function() {
        // If we don't have the capability to view then give up.
        if (this.get('disabled')){
            return;
        }

        if (window.location.href.indexOf("action=grader")>-1) {
            return;
        }

        this.addButton({
            icon: 'ed/helixadd',
            iconComponent: 'atto_helixatto',
            buttonName: 'helixadd',
            callback: this._displayDialogue
        });

        window.addEventListener("message", this._receiveMessage, false);
        //window.onunload=this._doInsert;
        hmlLaunchURL = this.get('baseurl')+"/mod/helixmedia/launch.php";
        ltiurl = this.get('ltiurl');
        //The interval timer doesn't seem to get the right scope for "this" to work inside _checkStatus, so set a global var here.
        buttonInstance = this;
    },

    /**
    * Listener for the helix selection complete event
    **/

    _receiveMessage: function(event) {
        var i=event.data.indexOf("preid_");
        if (i==0) {
            preid=event.data.substring(6);
            interval = setTimeout(buttonInstance._checkStatus, 5000);
        }
    },

    /**
    * Monitors the status of the video selection on the HML server
    * Note, this doesn't use setInterval so that this check will quickly die if there is a problem
    * rather than continuing for ever. The check is a convenience and isn't critical to the operation
    * of the plugin.
    **/

    _checkStatus: function() {
        var xmlDoc=null;

        if (typeof window.ActiveXObject != 'undefined' )
            xmlDoc = new ActiveXObject("Microsoft.XMLHTTP");
        else
            xmlDoc = new XMLHttpRequest();

        var params="resource_link_id="+preid+"&user_id="+buttonInstance.get('userid')+"&oauth_consumer_key="+buttonInstance.get('oauthConsumerKey');
        xmlDoc.open("POST", buttonInstance.get('statusurl') , false);
        xmlDoc.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlDoc.send(params);

        if (dialogueInstance!=null && dialogueInstance.get("visible")==false) {
            gotIn=false;
            return;
        }

        if (xmlDoc.responseText=="IN")
            gotIn=true;

        if (xmlDoc.responseText=="OUT" && gotIn==true) {
            // If we use the delay here, then the dialog close fails (why???) so we're going to ignore it for now.
            //var delay=parseInt(buttonInstance.get('insertdelay'));
            //if (delay>0)
            //    setTimeout(buttonInstance._doInsert, delay*1000);
            //else
                gotIn=false;
                buttonInstance._doInsert();
        } else {
            interval = setTimeout(buttonInstance._checkStatus, 2000);
        }
        
    },

     /**
     * Display the helixatto Dialogue
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function(e) {
        e.preventDefault();
        inserted = false;
        var width = document.documentElement.clientWidth-10;
        var height = document.documentElement.clientHeight-55;

        if (width>935) {
            width=935;
        }
        if (height>1400) {
            height=1400;
        }

        dwidth = width;
        dheight = height;
        dialogueInstance = this.getDialogue({
            headerContent: M.util.get_string('dialogtitle', COMPONENTNAME),
            width: width + 'px',
            height: height + 'px',
            draggable: false,
            overflowX: 'auto',
            constraintoviewport: false
        });

		//dialog doesn't detect changes in width without this
		//if you reuse the dialog, this seems necessary
        if(dialogueInstance.width !== width + 'px'){
            dialogueInstance.set('width',width+'px');
        }

        //append buttons to iframe
        var buttonform = this._getFormContent();

        var bodycontent =  Y.Node.create('<div></div>');
        bodycontent.append(buttonform);

        //set to bodycontent
        dialogueInstance.set('bodyContent', bodycontent);

        dialogueInstance.show();

        if(buttonInstance.get('hideinsert')=="1") {
            document.getElementById("medial_insert").style.visibility="hidden";
        } else {
            document.getElementById("medialiframe").style.height=(height-115)+"px";
        }

        this.markUpdated();
    },


     /**
     * Return the dialogue content for the tool, attaching any required
     * events.
     *
     * @method _getDialogueContent
     * @return {Node} The content to place in the dialogue.
     * @private
     */
    _getFormContent: function() {
        var template = Y.Handlebars.compile(TEMPLATE),
            content = Y.Node.create(template({
                elementid: this.get('host').get('elementid'),
                component: COMPONENTNAME,
                CSS: CSS,
                iframesrc: hmlLaunchURL+"?type=15",
                allow: 'microphone '+ltiurl+'; camera '+ltiurl,
                width:dwidth-30,
                height:dheight-90,
                style:"border:0px;"
            }));

        this._form = content;
        this._form.one('.' + CSS.INPUTSUBMIT).on('click', this._doInsert, this);

        return content;
    },

    /**
     * Inserts the users input onto the page
     * @method _getDialogueContent
     * @private
     */

    _doInsert : function(e){

        if (typeof(e) != "undefined")
            e.preventDefault();

        if (inserted)
            return;

        inserted = true;
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        this.editor.focus();

        var url=hmlLaunchURL+"?type=10&l="+preid;
        var html="<p><iframe style=\"overflow:hidden;border:0px none;background:#ffffff;width:680px;height:570px;\""+
            " src=\""+url+"\" id=\"hmlvid-"+preid+"\" allowfullscreen=\"true\" webkitallowfullscreen=\"true\" mozallowfullscreen=\"true\"></iframe>\n"+
            "</p>";

        this.get('host').insertContentAtFocusPoint(html);
        this.markUpdated();

    }
}, { ATTRS: {
		disabled: {
			value: false
		},

		usercontextid: {
			value: null
		},

		baseurl: {
			value: ''
		},

		ltiurl: {
			value: ''
		},

		statusurl: {
			value: ''
		},

		userid: {
			value: ''
		},

		hideinsert: {
			value: ''
		},

		insertdelay: {
			value: ''
		},

		oauthConsumerKey: {
			value: ''
		},
	}
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
