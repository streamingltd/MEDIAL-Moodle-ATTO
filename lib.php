<?php
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

/**
 * Atto text editor integration version file.
 *
 * @package    atto_helixatto
 * @copyright  2014 Streaming LTD
 * @author     Tim Williams (tmw@autotrain.org)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();
require_once ($CFG->dirroot.'/mod/helixmedia/locallib.php');

/**
 * Initialise this plugin
 * @param string $elementid
 */
function atto_helixatto_strings_for_js() {
    global $PAGE;

    $PAGE->requires->strings_for_js(array('insert',
                                          'cancel',
                                          'dialogtitle'),
                                    'atto_helixatto');
}

/**
 * Return the js params required for this module.
 * @return array of additional params to pass to javascript init function for this module.
 */
function atto_helixatto_params_for_js($elementid, $options, $fpoptions) {
    global $USER, $COURSE, $CFG, $PAGE;

    /**Switch of button when using the activity module.
       Use PARAM_RAW type here in case "add" is used for something other than a plugin name in other parts of moodle**/
    $add = optional_param("add", "none", PARAM_RAW);
    $action = optional_param("action", "none", PARAM_RAW);

    //coursecontext
    $coursecontext=context_course::instance($COURSE->id);	

    //usercontextid
    $usercontextid=context_user::instance($USER->id)->id;
    $disabled=false;

    //config our array of data
    $params = array();
    $params['usercontextid'] = $usercontextid;

    //If they don't have permission don't show it
    if(!has_capability('atto/helixatto:visible', $coursecontext) ){
        $disabled=true;
    }

    if ($add == "helixmedia" || $action == "grader" || $action == "grade" ||
        strpos($PAGE->url, '/forum/post.php')!==false) {
        $disabled = true;
    }

    //add our disabled param
    $params['disabled'] = $disabled;
    $params['baseurl'] = $CFG->wwwroot;
    $params['statusurl'] = helixmedia_get_status_url();
    $params['userid'] = $USER->id;
    $params['insertdelay'] = get_config('helixmedia', 'modal_delay');
    if ($params['insertdelay'] > -1)
        $params['hideinsert'] = get_config('atto_helixatto', 'hideinsert');
    else
        $params['hideinsert'] = "0";

    return $params;
}

