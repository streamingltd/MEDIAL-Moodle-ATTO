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
 * Strings for component 'atto_helixatto', language 'en'.
 *
 * @package    atto_helixatto
 * @copyright  2014 Streaming LTD
 * @author     Tim Williams (tmw@autotrain.org)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

$string['createhelixatto'] = 'Create Media Library resourse';
$string['pluginname'] = 'MEDIAL';
$string['settings'] = 'MEDIAL';
$string['browse'] = 'Browse';
$string['visible'] = 'Visible';
$string['modtypedesc'] = 'The MEDIAL Atto plugin has an alternative permission atto/helixatto:visiblemodtype which can be used to override the default MEDIAL atto permission, primarily so that students can be given access to the MEDIAL button in selected module types. By default no modules are enabled for this permission, but you can enable them by entering a list of module names in this box. The list should have one module name on each line and must use the underlying moodle code for the module written in lowercase, eg for Forums, enter forum. All modules included here will have the MEDIAL video generated as a link rather than an iframe, since iframes typically do not work for student users. Leave this blank if you do not wish to enable this feature.';
$string['modtypetitle'] = 'Modules that use the alternate permission';
$string['nothingtoinsert'] = 'Nothing to insert!';
$string['dialogtitle'] = 'Media Library';
$string['insert'] = 'Insert';
$string['cancel'] = 'Cancel';
$string['helixatto:visible'] = 'User can add MEDIAL videos using atto';
$string['helixatto:visiblemodtype'] = 'User can add MEDIAL videos using atto if the module is enabled for this permission in the atto plugin config';
$string['hideinsert'] = 'Hide the Insert button';
$string['hideinsert_desc'] = 'Hides the insert button at the bottom of the insert video dialog. Note: The insert button will aways be shown regardless of the setting here if the "Video add dialog box close delay in seconds" property of the activity module (helixmedia | modal_delay) is set to a negative number.';
$string['showvideo'] = 'View MEDIAL video';
$string['uselinktitle'] = 'Use a link to the MEDIAL resource';
$string['uselinkdesc'] = 'Some activity module types will strip out the MEDIAL iframe created by the MEDIAL ATTO plugin even for users who have teacher permissions. To work around this the atto plugin can generate a normal link to the resource instead. Modules should be listed here in the same way as the alternate permission function. The Workshop and Forum activities are known to do this so are included by default. If you would like the links to show as embedded iframes regardless, please install the MEDIAL filter plugin.';
