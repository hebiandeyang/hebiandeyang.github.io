/*********************************************************************
								 Notice
 
You may not modify, use, copy or distribute this file or its contents. 
Internal interfaces referenced in this file are nonpublic, unsupported 
and subject to change without notice. These interfaces may not be 
utilized in other software applications or components.


*********************************************************************/

// ============================================================ \\
// form_edit.js                                                 \\
// ------------                                                 \\
// This file contains functions that override what is comtained \\
// in form.js, that allow form preview and layout changes.      \\
// ============================================================ \\

FieldContainer.prototype.displayFields = function()
{
	var strDivName = "divFieldsContainer";
	if (this.IsHeading)
		strDivName = "divHeadingFieldsContainer";

	var FieldsHTML = getFields(this);
	var objDivFieldContainer = document.getElementById(strDivName);
	if (objDivFieldContainer != null)
		objDivFieldContainer.innerHTML = FieldsHTML;
}

function getFieldCellHTML(i_FormObject, i_objContainer)
{
	var FieldCellHTML = "";

	if (i_FormObject != null)
	{
		if (i_FormObject.Type == FormObjectType_TabGroup)
		{
			var StyleAttribute = "";
			if (i_FormObject.IsHidden)
				StyleAttribute = " STYLE=\"display:none;\"";

			var FieldBodyHTML = "<TABLE CELLPADDING=\"0\" CELLSPACING=\"0\" BORDER=\"0\" WIDTH=\"100%\"" + StyleAttribute + "><TR>";

			if (i_FormObject.Tabs.length > 1)
			{
				FieldBodyHTML += "<TD>";
				for (var i = 0; i < i_FormObject.Tabs.length; i++)
				{
					var Tab = i_FormObject.Tabs[i];
					var ClassAttribute = " CLASS=\"";
					if (i_FormObject.ActiveTabName == Tab.Name || (i == 0 && i_FormObject.ActiveTabName == ""))
					{
						i_FormObject.ActiveTabName = Tab.Name;
						ClassAttribute += "activeTab";
					}
					else
						ClassAttribute += "inactiveTab";
					FieldBodyHTML += "<SPAN STYLE=\"padding:2px 8px 2px 8px;\"" + ClassAttribute + "\" ID=\"" + Tab.Name + "\" ONCLICK=\"selectTab(obj" + Tab.Name + ", obj" + i_FormObject.Name + ")\" ONMOUSEOVER=\"hoverTab(obj" + Tab.Name + ", obj" + i_FormObject.Name + ")\">" + Tab.Text + "</SPAN>";
				}
				FieldBodyHTML += "</TD></TR><TR>";
			}
			FieldBodyHTML += "<TD CLASS=\"tabContents\">";

			for (var i = 0; i < i_FormObject.Tabs.length; i++)
			{
				var Tab = i_FormObject.Tabs[i];
				var StyleAttribute = " STYLE=\"display:none; width:100%;\"";
				if (i_FormObject.ActiveTabName == Tab.Name || (i == 0 && i_FormObject.ActiveTabName == ""))
					StyleAttribute = " STYLE=\"width:100%;\"";
				var LayoutScript = "";
				if (i_FormObject.Tabs.length == 1)
					LayoutScript = " ONCLICK=\"selectTab(obj" + Tab.Name + ", obj" + i_FormObject.Name + ")\" ONMOUSEOVER=\"hoverTab(obj" + Tab.Name + ", obj" + i_FormObject.Name + ")\"";
				FieldBodyHTML += "<DIV ID=\"" + Tab.Name + "Contents\"" + StyleAttribute + LayoutScript + ">";
				FieldBodyHTML += getTableHTML(Tab);
				FieldBodyHTML += "</DIV>";
			}
			FieldBodyHTML += "</TD></TR></TABLE>";

			// The CLASS attribute for the TD tag.
			var ClassAttribute = "";
			if (i_FormObject.ClassName != "")
				ClassAttribute = " CLASS=\"" + i_FormObject.ClassName + "\"";
			// The ONCLICK attribute for the TD tags.
			var OnClickAttribute = " ONCLICK=\"if (typeof obj" + i_FormObject.Name + " != 'undefined') { selectField(obj" + i_FormObject.Name + "); }\"";
			var OnMouseOverAttribute = " ONMOUSEOVER=\"if (typeof obj" + i_FormObject.Name + " != 'undefined') { hoverField(obj" + i_FormObject.Name + "); }\"";
			// The TITLE attribute for the TD tags.
			var TitleAttribute = " TITLE=\"Click to select this field: " + i_FormObject.Name + "\"";
			// The common attributes for label and field TD tags.
			var LabelAttributes = " VALIGN=\"top\" STYLE=\"cursor:hand;\"" + OnClickAttribute + OnMouseOverAttribute + " ID=\"" + i_FormObject.Name + "_label\"" + ClassAttribute + TitleAttribute;
			var FieldAttributes = " VALIGN=\"top\" STYLE=\"cursor:hand;\"" + OnClickAttribute + OnMouseOverAttribute + " ID=\"" + i_FormObject.Name + "_field\"" + ClassAttribute + TitleAttribute;
			// The COLSPAN attribute for the TD tag.
			var ColumnSpan = getSpanAttribute("COLSPAN", i_FormObject.ColumnSpan * 2);
			var RowSpan = getSpanAttribute("ROWSPAN", i_FormObject.RowSpan);
			// The COLSPAN attribute for the TD tag.
			var FieldColumnSpan = getSpanAttribute("COLSPAN", (i_FormObject.ColumnSpan * 2) - 1);
			// The FONT tag containing the field label.
			var FieldLabel = "<FONT CLASS=\"fieldLabel\">" + getFieldLabel(i_FormObject) + "</FONT>";

			switch (i_FormObject.LabelPosition)
			{
				case "Right":
					FieldCellHTML += "<TD" + FieldAttributes + RowSpan + ">" + FieldBodyHTML + "</TD>";
					FieldCellHTML += "<TD" + LabelAttributes + FieldColumnSpan + RowSpan + ">" + FieldLabel + "</TD>";
					break;
				case "Top":
					var LineBreak = "<BR>";
					if (getFieldLabel(i_FormObject).indexOf("<div") >= 0)
						LineBreak = "";
					FieldCellHTML += "<TD" + FieldAttributes + ColumnSpan + RowSpan + ">" + ((getFieldLabel(i_FormObject) != "") ? FieldLabel + LineBreak : "") + FieldBodyHTML + "</TD>";
					break;
				default:
					FieldCellHTML += "<TD" + LabelAttributes + RowSpan + ">" + FieldLabel + "</TD>";
					FieldCellHTML += "<TD" + FieldAttributes + FieldColumnSpan + RowSpan + ">" + FieldBodyHTML + "</TD>";
					break;
			}
		}
		else
		{
			// Get the body HTML for the field.
			var FieldBodyHTML = "";
			if (i_FormObject.Type == FormObjectType_FieldGroup)
				FieldBodyHTML = getFieldGroupBody(i_FormObject, true);
			else
				FieldBodyHTML = i_FormObject.getBody();

			// The STYLE attribute for TD tags.
			var FieldStyleAttribute = "";
			var LabelStyleAttribute = "";
			// Hide fields that should be hidden.
			if (i_FormObject.IsHidden)
			{
				FieldStyleAttribute += " STYLE=\"display:none;\"";
				LabelStyleAttribute += " STYLE=\"display:none;\"";
			}

			// The CLASS attribute for the TD tags.
			var ClassAttribute = "";
			if (i_FormObject.ClassName != "")
				ClassAttribute = " CLASS=\"" + i_FormObject.ClassName + "\"";
			// None of these properties apply to form heading fields.
			var OnClickAttribute = "";
			var OnMouseOverAttribute = "";
			var TitleAttribute = "";
			var LabelAttributes = " VALIGN=\"top\"";
			var FieldAttributes = " VALIGN=\"top\"";
			var ColumnSpan = "";
			var RowSpan = getSpanAttribute("ROWSPAN", i_FormObject.RowSpan);
			// If it is not a form heading field, set appropriate attributes.
			if (!i_objContainer.IsHeading)
			{
				// The ONCLICK attribute for the TD tags.
				OnClickAttribute = " ONCLICK=\"if (typeof obj" + i_FormObject.Name + " != 'undefined') { selectField(obj" + i_FormObject.Name + "); }\"";
				OnMouseOverAttribute = " ONMOUSEOVER=\"if (typeof obj" + i_FormObject.Name + " != 'undefined') { hoverField(obj" + i_FormObject.Name + "); }\"";
				// The TITLE attribute for the TD tags.
				TitleAttribute = " TITLE=\"Click to select this field: " + i_FormObject.Name + "\"";
				// The common attributes for label and field TD tags.
				var LabelAttributes = " VALIGN=\"top\" STYLE=\"cursor:hand;\"" + OnClickAttribute + OnMouseOverAttribute + " ID=\"" + i_FormObject.Name + "_label\"" + ClassAttribute + TitleAttribute;
				var FieldAttributes = " VALIGN=\"top\" STYLE=\"cursor:hand;\"" + OnClickAttribute + OnMouseOverAttribute + " ID=\"" + i_FormObject.Name + "_field\"" + ClassAttribute + TitleAttribute;
				// The COLSPAN attribute for the TD tag.
				var ColumnSpan = getSpanAttribute("COLSPAN", i_FormObject.ColumnSpan * 2);
			}

			if (i_FormObject instanceof Static)
			{
				var AlignAttribute = "";
				if (i_FormObject.Center)
					AlignAttribute = " ALIGN=\"center\"";

				FieldCellHTML += "<TD" + FieldAttributes + FieldStyleAttribute + AlignAttribute + ColumnSpan + RowSpan + ">" + FieldBodyHTML + "</TD>";
			}
			else
			{
				// The COLSPAN attribute for the TD tag.
				var FieldColumnSpan = getSpanAttribute("COLSPAN", (i_FormObject.ColumnSpan * 2) - 1);
				// The FONT tag containing the field label.
				var FieldLabel = "<FONT CLASS=\"fieldLabel\">" + getFieldLabel(i_FormObject) + i_FormObject.getRequired() + "</FONT>";

				switch (i_FormObject.LabelPosition)
				{
					case "Right":
						FieldCellHTML += "<TD" + FieldAttributes + FieldStyleAttribute + RowSpan + ">" + FieldBodyHTML + "</TD>";
						FieldCellHTML += "<TD" + LabelAttributes + LabelStyleAttribute + FieldColumnSpan + RowSpan + ">" + FieldLabel + "</TD>";
						break;
					case "Top":
						var LineBreak = "<BR>";
						if (getFieldLabel(i_FormObject).indexOf("<div") >= 0)
							LineBreak = "";
						FieldCellHTML += "<TD" + FieldAttributes + FieldStyleAttribute + ColumnSpan + RowSpan + ">" + ((getFieldLabel(i_FormObject) != "" || i_FormObject.getRequired() != "") ? FieldLabel + LineBreak : "") + FieldBodyHTML + "</TD>";
						break;
					default:
						FieldCellHTML += "<TD" + LabelAttributes + LabelStyleAttribute + RowSpan + ">" + FieldLabel + "</TD>";
						FieldCellHTML += "<TD" + FieldAttributes + FieldStyleAttribute + FieldColumnSpan + RowSpan + ">" + FieldBodyHTML + "</TD>";
						break;
				}
			}
		}
	}
	else
	{
		FieldCellHTML += "<TD COLSPAN=\"2\"></TD>";
	}

	return FieldCellHTML;
}