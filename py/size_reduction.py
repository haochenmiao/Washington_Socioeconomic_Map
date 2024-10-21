import json
from shapely.geometry import shape, mapping
from geojson import FeatureCollection

# Load GeoJSON file
with open('./assets/Normalized_Unemployed_Population.geojson') as f:
    data = json.load(f)

simplified_features = []

# Simplify each feature's geometry
for feature in data['features']:
    geom = shape(feature['geometry'])
    
    # Simplify geometry, tolerance value controls simplification level
    simplified_geom = geom.simplify(tolerance=0.001, preserve_topology=True)
    
    # Overwrite the feature geometry with simplified geometry
    feature['geometry'] = mapping(simplified_geom)
    
    # Remove unnecessary properties if needed
    if 'SHAPE_Length' in feature['properties']:
        del feature['properties']['SHAPE_Length']
    
    simplified_features.append(feature)

# Create new GeoJSON FeatureCollection
simplified_geojson = FeatureCollection(simplified_features)

# Save the simplified GeoJSON to a new file
with open('./assets/simplified_Normalized_Unemployed_Population.geojson', 'w') as f:
    json.dump(simplified_geojson, f, indent=2)

print("Simplified GeoJSON saved!")
