OpenRouteService.OpenLS.Accessibility = Class.create(OpenRouteService.OpenLS, {
	initialize : function() {
		this.serviceUrl = OpenRouteService.namespaces.services.analyse;
		this.schemaLocation = OpenRouteService.namespaces.schemata.analyseService;
	},

	/**
	 * builds an XML request based on the given parameters which can be sent to the service.
	 * @position: OpenLayers.LonLat with center position
	 * @time: time radius
	 */
	buildRequest : function(position, time) {
		var ns = OpenRouteService.namespaces;

		var writer = new XMLWriter('UTF-8', '1.0');
		writer.writeStartDocument();
		//<aas:AAS>
		writer.writeElementString('aas:AAS');
		writer.writeAttributeString('version', '1.0');
		writer.writeAttributeString('xmlns:aas', ns.analyse);
		writer.writeAttributeString('xmlns:xsi', ns.xsi);
		writer.writeAttributeString('xsi:schemaLocation', this.schemaLocation);
		//<aas:RequestHeader />
		writer.writeElementString('aas:RequestHeader');
		//<aas:Request>
		writer.writeStartElement('aas:Request');
		writer.writeAttributeString('methodName', 'AccessibilityRequest');
		writer.writeAttributeString('requestID', '4711');
		writer.writeAttributeString('version', '1.0');
		//<aas:DetermineAccessibilityRequest>
		writer.writeStartElement('aas:DetermineAccessibilityRequest');
		//<aas:Accessibility>
		writer.writeStartElement('aas:Accessibility');
		//<aas:AccessibilityPreference
		writer.writeStartElement('aas:AccessibilityPreference');
		//<aas:Time />
		writer.writeStartElement('aas:Time');
		writer.writeAttributeString('Duration', 'PT0H' + time + 'M00S');
		writer.writeEndElement();
		//</aas:AccessibilityPreference
		writer.writeEndElement();
		//<aas:LocationPoint>
		writer.writeStartElement('aas:LocationPoint');
		//<aas:Position>
		writer.writeStartElement('aas:Position');
		//<gml:Point>
		writer.writeStartElement('gml:Point');
		writer.writeAttributeString('xmlns:gml', ns.gml);
		writer.writeAttributeString('srsName', 'EPSG:4326');
		//<gml:pos />
		writer.writeStartElement('gml:pos');
		writer.writeString(position.lon + ' '  + position.lat);
		writer.writeEndElement();
		//</gml:Point>
		writer.writeEndElement();
		//</aas:Position>
		writer.writeEndElement();
		//</aas:LocationPoint>
		writer.writeEndElement();
		//</aas:Accessibility>
		writer.writeEndElement();
		//<aas:AccessibilityGeometryRequest>
		writer.writeStartElement('aas:AccessibilityGeometryRequest');
		//<aas:PolygonPreference />
		writer.writeStartElement('aas:PolygonPreference');
		writer.writeString('Detailed');
		writer.writeEndElement();
		//</ aas:AccessibilityGeometryRequest
		writer.writeEndElement();
		//</ aas:DetermineAccessibilityRequest
		writer.writeEndElement();
		//</aas:Request>
		writer.writeEndElement();
		//</aas:AAS>
		writer.writeEndDocument();
		
		this.xmlRequest = writer.flush();
		writer.close();
	},

	/**
	 * parses the xml response
	 */
	getResponse : function() {
		//processing is done in ORS.Gui.AccessibilityAnalysis		
		return this.xmlResponse;
	}
});
