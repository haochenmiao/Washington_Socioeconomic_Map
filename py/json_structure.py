import json

# Function to transform to GeoJSON
def transform_to_geojson(input_file, output_file):
    # Open and read the original JSON file
    with open(input_file, 'r') as file:
        data = json.load(file)

    # Initialize the GeoJSON structure
    geojson_data = {
        "type": "FeatureCollection",
        "features": []
    }

    # Loop through each feature in the input data
    for feature in data:
        # Create the new feature structure
        new_feature = {
            "type": "Feature",
            "geometry": {
                "type": feature.get('geometry_type', 'Polygon'),  # Use the geometry type from the original data
                "coordinates": feature['geometry_coordinates']
            },
            "properties": {
                # Add all properties, renaming them
                "OBJECTID": feature['properties_OBJECTID'],
                "Census_Tract": feature['properties_Census_Tract'],
                "IBL_Rank": feature['properties_IBL_Rank'],
                "EHD_Rank": feature['properties_EHD_Rank'],
                "Env_SEF_Rank": feature['properties_Env_SEF_Rank'],
                "Num_Unemployed": feature['properties_Num_Unemployed'],
                "Employable_Population_Over15": feature['properties_Employable_Population_Over15'],
                "Percent_Unemployed": feature['properties_Percent_Unemployed'],
                "Lower_ME": feature['properties_Lower_ME'],
                "Upper_ME": feature['properties_Upper_ME'],
                "Normalized_Unemployed_Percent": feature['Normalized_Unemployed_Percent']
            }
        }
        # Add the transformed feature to the FeatureCollection
        geojson_data['features'].append(new_feature)

    # Write the transformed data to the output file
    with open(output_file, 'w') as outfile:
        json.dump(geojson_data, outfile, indent=4)

# Define the input and output file paths
input_file = './assets/Normalized_Unemployed_Population.json'  # Path to your input file
output_file = './assets/Normalized_Unemployed_Population.geojson'  # Path to save the transformed GeoJSON

# Transform and save the file
transform_to_geojson(input_file, output_file)
print(f"Transformed: {input_file} and saved to {output_file}")
