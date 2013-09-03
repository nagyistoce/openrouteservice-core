OpenRouteService.Gui.AccessibilityAnalysis = Class.create(OpenRouteService.Gui, {
	initialize : function(routeInstance) {
		this.routeInstance = routeInstance;
	},

	analyze : function(timeInMinutes) {
		var waypoints = this.routeInstance.waypoints;
		var startPoint;
		if (waypoints && waypoints.length > 0) {
			startPoint = waypoints[0];
		}

		if (startPoint.pointType === 'unset') {
			//display an error message if there is no start point
			return false;
		} else {
			//start point exists
			var layer = this.routeInstance.map.getLayersByName(OpenRouteService.Map.ACCESSIBILITY)[0];

			//remove previous calculations
			layer.removeAllFeatures();

			if (startPoint.mapRepresentation && startPoint.mapRepresentation.geometry) {
				var geo = startPoint.mapRepresentation.geometry;
				startPoint = new OpenLayers.LonLat(geo.x, geo.y);
				startPoint = startPoint.transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));

				var self = this;
				var accessibilityService = new OpenRouteService.OpenLS.Accessibility();
				accessibilityService.buildRequest(startPoint, timeInMinutes);
				accessibilityService.requestData(
				//callback
				function() {
					var map = self.routeInstance.map;
					var xmlResponse = accessibilityService.getResponse();

					var boundingBox = OpenRouteService.Util.getElementsByTagNameNS(xmlResponse, OpenRouteService.namespaces.analyse, 'BoundingBox');
					boundingBox = boundingBox ? boundingBox[0] : null;
					var bounds = new OpenLayers.Bounds();
					$A(OpenRouteService.Util.getElementsByTagNameNS(boundingBox, OpenRouteService.namespaces.gml, 'pos')).each(function(position) {
						position = OpenRouteService.convert.gml2ol.pos2lonLat(position, map.getProjection());
						bounds.extend(position);
					});
					map.zoomToExtent(bounds, true);

					var area = OpenRouteService.Util.getElementsByTagNameNS(xmlResponse, OpenRouteService.namespaces.analyse, 'AccessibilityGeometry');
					area = area ? area[0] : null;

					//use first polygon only
					var polygon = OpenRouteService.Util.getElementsByTagNameNS(area, OpenRouteService.namespaces.gml, 'Polygon')[0];
					var linRingPoints = [];
					$A(OpenRouteService.Util.getElementsByTagNameNS(polygon, OpenRouteService.namespaces.gml, 'pos')).each(function(polygonPos) {
						polygonPos = OpenRouteService.convert.gml2ol.pos2lonLat(polygonPos, map.getProjection());
						polygonPos = new OpenLayers.Geometry.Point(polygonPos.lon, polygonPos.lat);
						linRingPoints.push(polygonPos);
					});
					var ring = new OpenLayers.Geometry.LinearRing(linRingPoints);
					var poly = new OpenLayers.Geometry.Polygon([ring]);
					var newFeature = new OpenLayers.Feature.Vector(poly);
					newFeature.style = {
						'strokeColor' : '#0000ff',
						'fillColor' : '#0000ff',
						'fillOpacity' : 0.4
					};
					layer.addFeatures([newFeature]);
					
					//hide searching spinner
					document.getElementById('accessibilityCalculation').hide();
				});

			}
		}
	}
});
