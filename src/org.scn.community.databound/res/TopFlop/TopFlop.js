/**
 * Copyright 2014 SCN SDK Community
 * 
 * Original Source Code Location:
 *  https://github.com/org-scn-design-studio-community/sdkpackage/
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at 
 *  
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
 * See the License for the specific language governing permissions and 
 * limitations under the License. 
 */

(function() {
/** code for recognition of script path */
var myScript = $("script:last")[0].src;
_readScriptPath = function () {
	if(myScript) {
		var myScriptSuffix = "res/TopFlop/";
		var mainScriptPathIndex = myScript.indexOf(myScriptSuffix);
 		var ownScriptPath = myScript.substring(0, mainScriptPathIndex) + myScriptSuffix;
 		return ownScriptPath;
	}
		
	return "";
},
/** end of path recognition */

sap.ui.commons.layout.AbsoluteLayout.extend("org.scn.community.databound.TopFlop", {

	setFallbackPicture : function(value) {
		this._FallbackPicture = value;
		
		if(value != undefined && value != "")  {
			this._pImagePrefix = value.substring(0, value.lastIndexOf("/") + 1);	
		}
	},

	getFallbackPicture : function() {
		return this._FallbackPicture;
	},
	
	metadata: {
        properties: {
              "maxNumber": {type: "int"},
              "topBottom": {type: "string"},
              "usePictures": {type: "boolean"},
              "addCounter": {type: "boolean"},
              "valueDecimalPlaces": {type: "int"},
              "selectedKey": {type: "string"},
              "pressedKey": {type: "string"},
              "valuePrefix": {type: "string"},
              "valueSuffix": {type: "string"},
              "deltaValueSuffix": {type: "string"},
              "fixedAverage": {type: "int"},
              "averagePrefix": {type: "string"},
              "averageSuffix": {type: "string"}
        }
	},
	
	setData : function(value) {
		this._data = value;
		return this;
	},
	
	getData : function(value) {
		return this._data;
	},
	
	setMetadata : function(value) {
		this._metadata = value;
		return this;
	},

	getMetadata : function(value) {
		return this._metadata;
	},
  
	initDesignStudio: function() {
		var that = this;
		this._ownScript = _readScriptPath();
		
		this._oElements = {};
		
		this.addStyleClass("scn-pack-DataTopFlop");
	},
	
	renderer: {},
	
	afterDesignStudioUpdate : function() {
		var that = this;
		
		if(!this._lLayout) {
			this._lLayout = new sap.ui.layout.VerticalLayout({
				
			});

			this.addContent(
				this._lLayout,
				{left: "0px", top: "2px"}	
			);
		}
		
		var propertiesNow = this._serializeProperites("selectedKey;pressedKey");

		var rerender = false;
		if(this._serializedPropertiesAfter != propertiesNow) {
		  this._serializedPropertiesAfter = propertiesNow;
		  rerender = true;
		}
		
		if(rerender) {
			this._oElements = {};
			
			this._maxValue = undefined;
			this._maxDelta = -1;
			
			var lData = this._data;
			var lMetadata = this._metadata;
			
var options = org_scn_community_databound.initializeOptions();
			
			options.iMaxNumber = this.getMaxNumber();
			options.iTopBottom = this.getTopBottom();
			options.iSortBy = "Value";
			options.iDuplicates = "Ignore";
			options.iNnumberOfDecimals = this.getValueDecimalPlaces();
			
			var returnObject = org_scn_community_databound.getTopBottomElementsForDimension 
		     (lData, lMetadata, "", options);
			
			lElementsToRenderArray = returnObject.list;

			// Destroy old content
			this._lLayout.destroyContent();

			// find highest value
			for (var i = 0; i < lElementsToRenderArray.length; i++) {
				var element = lElementsToRenderArray[i];
				if(this._maxValue == undefined) {
					this._maxValue = element.value;
				}
				if(element.value > this._maxValue) {
					this._maxValue = element.value;
				}
			}
			
			if(this._maxValue == 0) {
				this._maxValue = 1;
			}
			
			// distribute content
			for (var i = 0; i < lElementsToRenderArray.length; i++) {
				var element = lElementsToRenderArray[i];
				var lImageElement = this.createLeaderElement(i, element.key, element.text, element.url, element.value, element.valueS, element.counter, element.delta, returnObject);
				this._oElements[element.key] = lImageElement;
				this._lLayout.addContent(lImageElement);
			}

			// insert Average Information
			var oText = new sap.ui.commons.TextView();
			oText.addStyleClass("scn-pack-DataTopFlop-AverageText");
			oText.setText(this.getAveragePrefix() + org_scn_community_basics.getFormattedValue(returnObject.average, this._metadata.locale, this.getValueDecimalPlaces()) + this.getAverageSuffix());
			this._lLayout.addContent(
					oText
			);	
		} else {
			for (lElementKey in this._oElements) {
				var lElement = this._oElements[lElementKey];
				
				if(this.getSelectedKey() == lElement.internalKey) {
					lElement.addStyleClass("scn-pack-DataTopFlop-SelectedValue");
				} else {
					lElement.removeStyleClass("scn-pack-DataTopFlop-SelectedValue");
				}
			}
		}

	},
	
	createLeaderElement: function (index, iImageKey, iImageText, iImageUrl, value, valueAsString, counter, delta, returnObject) {
		var that = this;
		
		// in case starts with http, keep as is 
		if(iImageUrl.indexOf("http") == 0) {
			// no nothing
		} else {
			// in case of repository, add the prefix from repository
			if(this._pImagePrefix != undefined && this._pImagePrefix != ""){
				iImageUrl = this._pImagePrefix + iImageUrl;
				var extension = this.getFallbackPicture();
				extension = extension.substring(extension.lastIndexOf("."));

				iImageUrl = iImageUrl + extension;
			} else {
				iImageUrl = this._ownScript + "DTopFlop.png";
			}
		}
		
		var lUsePictures = this.getUsePictures();
		var lAddCounter = this.getAddCounter();
		
		var lLeftMargin = "35px";
		var lLeftMarginPicture = "35px";
		
		if(lUsePictures && lAddCounter) {
			lLeftMargin = "72px";
			lLeftMarginPicture = "35px";
		} else if (lUsePictures) {
			lLeftMargin = "38px";
			lLeftMarginPicture = "2px";
		} else if (lAddCounter) {
			lLeftMargin = "35px";
			lLeftMarginPicture = "2px";
		}
		
		var oLayout = new sap.ui.commons.layout.AbsoluteLayout ({
			width: "225px",
			height: "40px"
		});
		
		if(delta < 0) {
			delta = delta * -1;
		}
		
		var lSizeValueBackground = (225 - 120) * returnObject.maxDelta / returnObject.maxDelta;
		var lSizeValue = (225 - 120) * delta / returnObject.maxDelta;
		
		var oValueLayout = new sap.ui.commons.layout.AbsoluteLayout ({
			width: lSizeValue + "px",
			height: "3px"
		});
		
		var oValueLayoutBackground = new sap.ui.commons.layout.AbsoluteLayout ({
			width: lSizeValueBackground + "px",
			height: "3px"
		});
		
		oValueLayoutBackground.addStyleClass("scn-pack-DataTopFlop-ValueLayout");
		
		if(value < returnObject.average) {
			oValueLayout.addStyleClass("scn-pack-DataTopFlop-ValueLayoutBad");
		} else {
			oValueLayout.addStyleClass("scn-pack-DataTopFlop-ValueLayoutGood");
		}

		oLayout.addContent(
				oValueLayoutBackground,
				{right: "2px", bottom: "3px"}	
		);
		oLayout.addContent(
				oValueLayout,
				{right: "2px", bottom: "3px"}	
		);
		
		oLayout.addStyleClass("scn-pack-DataTopFlop-Layout");
		oLayout.internalKey = iImageKey;

		if(this.getAddCounter()) {
			var oIndexText = new sap.ui.commons.TextView();
			oIndexText.addStyleClass("scn-pack-DataTopFlop-IndexText");
			oIndexText.setText(counter + ".");
			
			oLayout.addContent(
					oIndexText,
					{right: "200px", top: "10px"}
			);
		}
		
		oNameLink = new sap.ui.commons.Link();
		oNameLink.addStyleClass("scn-pack-DataTopFlop-Link");

		oLayout.addContent(
				oNameLink,
				{left: lLeftMargin, top: "1px"}	
		);

		var oImage = new sap.ui.commons.Image ({
			src : iImageUrl,
			width : "32px",
			height : "32px",
			alt : iImageText,
			tooltip : iImageText,
		});

		oImage.addStyleClass("scn-pack-DataTopFlop-Picture");
		oImage.internalKey = iImageKey;
		
		if(lUsePictures) {
			oLayout.addContent(
					oImage,
					{left: lLeftMarginPicture, top: "5px"}
			);
		}

		var oText = new sap.ui.commons.TextView();
		oText.addStyleClass("scn-pack-DataTopFlop-Text");
		
		oLayout.addContent(
				oText,
				{left: lLeftMargin, bottom: "3px"}
		);
		
		var oTextDeltaValue = new sap.ui.commons.TextView();
		oTextDeltaValue.addStyleClass("scn-pack-DataTopFlop-TextDelta");
		
		oLayout.addContent(
				oTextDeltaValue,
				{right: "2px", top: "1px"}
		);
		
		if(this.getSelectedKey() == iImageKey) {
			oLayout.addStyleClass("scn-pack-DataTopFlop-SelectedValue");
		}
		
		oNameLink.attachBrowserEvent('click', function() {
			that._linkEvent = true;
			that.setPressedKey(oImage.internalKey);
			
			that.fireDesignStudioPropertiesChanged(["pressedKey"]);
			that.fireDesignStudioEvent("onPress");
		});

		oLayout.attachBrowserEvent('click', function () {
			if(that._linkEvent == true) {
				that._linkEvent = false;
			} else {
				that.setSelectedKey(oImage.internalKey);
				that.updateSelection(oImage.internalKey);
				
				that.fireDesignStudioPropertiesChanged(["selectedKey"]);
				that.fireDesignStudioEvent("onSelectionChanged");
			}
		});
		
		oNameLink.setText (iImageText);
		oNameLink.setTooltip (iImageText);

		if(lUsePictures) {
			var requestForPicture = new XMLHttpRequest();
			
			requestForPicture.onreadystatechange = function() {
				// check status and react
				if (requestForPicture.readyState == 4){
					var imageToLoad = undefined;
					
					// sometimes it gets 200 without content
					if(requestForPicture.status == 404 || requestForPicture.responseUrl == "" || requestForPicture.response == "") {
						imageToLoad = that.getFallbackPicture();
					} else {
						imageToLoad = iImageUrl;
					};
					
					oImage.setSrc(imageToLoad);
				};
			};
			
			// just a check if there is some picture at all
			if(iImageUrl != undefined && iImageUrl != "") {
				requestForPicture.open("GET", iImageUrl, true);
				requestForPicture.send();
			}
		}
		
		oText.setText (this.getValuePrefix() + valueAsString + this.getValueSuffix());
		
		var delta = value - returnObject.average;
		if(delta > 0) {
			oTextDeltaValue.setText (" Δ " + "+" + org_scn_community_basics.getFormattedValue(delta, this._metadata.locale, this.getValueDecimalPlaces()) + this.getDeltaValueSuffix());	
		} else {
			oTextDeltaValue.setText (" Δ " + org_scn_community_basics.getFormattedValue(delta, this._metadata.locale, this.getValueDecimalPlaces()) + this.getDeltaValueSuffix());
		}
		
		
		return oLayout;
	},
	
	updateSelection : function (iSelectedKey) {
		var lContent = this._lLayout.getContent();
		
		for (var i = 0; i < lContent.length; i++) {
			var lLayout = lContent [i];
			
			if(iSelectedKey == lLayout.internalKey){
				lLayout.addStyleClass("scn-pack-DataTopFlop-SelectedValue");
			} else {
				lLayout.removeStyleClass("scn-pack-DataTopFlop-SelectedValue");
			};
		};
	},
	
	_fFormatNumber : function (value) {
		if(!this._metadata) {
			return value;
		}
		
		sap.common.globalization.NumericFormatManager.setPVL(this._metadata.locale);
		var strFormat = "#"+sap.common.globalization.NumericFormatManager.getThousandSeparator()+"##0";
		
		if (this.getValueDecimalPlaces() > 0) {
			strFormat += sap.common.globalization.NumericFormatManager.getDecimalSeparator();
			for (var i = 0; i < this.getValueDecimalPlaces(); i++) {
				strFormat += "0";
			}
		}
		
		var valueFormatted = sap.common.globalization.NumericFormatManager.format(value, strFormat);
		return valueFormatted;
	},
	
	_serializeProperites : function (excluding){
		var props = this.oComponentProperties.content.control;

		if(excluding == undefined) {
			excluding = "";
		}

		var serialization = "";
		for (var key in props) {
		  if (props.hasOwnProperty(key) && excluding.indexOf(key) == -1) {
			  serialization = serialization + key + "->" + props[key] + ";";
		  }
		}
		
		// size
		serialization = serialization + "W->" + this.oComponentProperties.width;
		serialization = serialization + "H->" + this.oComponentProperties.height;
		// data
		serialization = serialization + "DATA->" + JSON.stringify(this._data);
		serialization = serialization + "METADATA->" + JSON.stringify(this._metadata);

		return serialization;
	},

});
})();