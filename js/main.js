// MAP CODE BELOW ONLY
let page = document.body.id;

if (page == 'map-page') {
    mapboxgl.accessToken =
        'pk.eyJ1IjoiaGFvY2gwNDIzIiwiYSI6ImNtMmk1MGhzeDBpajAybXB5d3ZrMjJxa2oifQ.4aD8xH6BjwIb-HzlRNaSbQ';
    const map = new mapboxgl.Map({
        style: 'mapbox://styles/haoch0423/cleesckzn000501nw8wjmfeza',
        center: [-120.83628494223058, 47.63748628060085], // centered on seattle, may need to be changed
        zoom: 6,
        container: 'map',
        antialias: true,
        projection: 'mercator',
        pitch: 45, // The angle the map camera starts at
        maxZoom: 10.5,
        minZoom: 6,
        maxBounds: [
            [-133.68163130881976, 39.32091789058595],
            [-109.06713519997989, 54.215746760525796]
        ]
    });

    map.on('load', function loadingData() {
        const layers = map.getStyle().layers;
        // Find the index of the first symbol layer in the map style.
        let firstSymbolId;
        for (const layer of layers) {
            if (layer.type === 'symbol') {
                firstSymbolId = layer.id;
                break;
            }
        }

        map.addSource('low_birth_data', {
            type: 'geojson',
            'generateId': true, // crucially important for click color change to work
            data: './assets/Normalized_Low_Birth_Weight.json'
        });

        map.addSource('people_color_data', {
            type: 'geojson',
            'generateId': true, // crucially important for click color change to work
            data: './assets/Normalized_People_of_Color_Washington.json'
        });

        map.addSource('population_noHighSchool_data', {
            type: 'geojson',
            'generateId': true, // crucially important for click color change to work
            data: './assets/Normalized_No_High_School_Diploma_Washington.json'
        });

        map.addSource('poverty_data', {
            type: 'geojson',
            'generateId': true, // crucially important for click color change to work
            data: './assets/Normalized_Poverty_Population_Washington.json'
        });

        map.addSource('unaffordable_data', {
            type: 'geojson',
            'generateId': true, // crucially important for click color change to work
            data: './assets/Normalized_Unaffordable_Housing.json'
        });

        map.addSource('unemployed_data', {
            type: 'geojson',
            'generateId': true, // crucially important for click color change to work
            data: './assets/Normalized_Unemployed_Population.json'
        });

        map.addLayer({
                'id': 'low_birth-extrusion',
                'type': 'fill-extrusion',
                'filter': ['!=', ["get", "Census_Tract"], null],
                'source': 'low_birth_data',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    // Get the fill-extrusion-color from the source color property.
                    'fill-extrusion-color': [
                        "case",
                        ['boolean', ["feature-state", 'clicked'],
                            false
                        ], // If the 'clicked' variable of a feature is true, then color
                        "#1cd4d0",
                        ['==', ["get", "Normalized_Percent_Singleton_Live_Births"],
                            null
                        ], //color null values a certain color, testing for now
                        '#cccecf',
                        ["step", ["get",
                                "Normalized_Percent_Singleton_Live_Births"
                            ], // else color step based on bins
                            '#ffffcc', // stop_output_0
                            10, // stop_input_0
                            '#ffeda0', // stop_output_1
                            20, // stop_input_1
                            '#fed976', // stop_output_2
                            30, // stop_input_2
                            '#feb24c', // stop_output_3
                            40, // stop_input_3
                            '#fd8d3c', // stop_output_4
                            50, // stop_input_4
                            '#fc4e2a', // stop_output_5
                            60, // stop_input_5
                            '#e31a1c', // stop_output_6
                            70, // stop_input_6
                            '#b10026'
                        ]
                    ],
                    'fill-extrusion-height': [ // Get fill-extrusion-height from the source Percent_Units_with_Lead property
                        "interpolate", [
                            "linear"
                        ], // change height as we zoom in (needs to find a standard for all layers)
                        ["zoom"],
                        0, ["*", ['get', 'Normalized_Percent_Singleton_Live_Births'],
                            2000
                        ], //This expression multiplies data value to determine height of polygon (need to fiddle with these)
                        13, .5
                    ],
                    'fill-extrusion-opacity': .9
                }
            },
            firstSymbolId
        );

        map.addLayer({
                'id': 'people_color-extrusion',
                'type': 'fill-extrusion',
                'source': 'people_color_data',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    // Get the fill-extrusion-color from the source color property.
                    'fill-extrusion-color': [
                        "case",
                        ['boolean', ["feature-state", 'clicked'],
                            false
                        ], // If the 'clicked' variable of a feature is true, then color
                        "#1cd4d0",
                        ['==', ["get", "Normalized_Percent_People_of_Color"],
                            null
                        ], //color null values a certain color
                        '#cccecf',
                        ["step", ["get", "Normalized_Percent_People_of_Color"], // else color step based on bins
                            '#ffffe5', // stop_output_0
                            10, // stop_input_0
                            '#d9f0a3', // stop_output_1
                            20, // stop_input_1
                            '#addd8e', // stop_output_2
                            30, // stop_input_2
                            '#78c679', // stop_output_3
                            40, // stop_input_3
                            '#41ab5d', // stop_output_4
                            50, // stop_input_4
                            '#238443', // stop_output_5
                            60, // stop_input_5
                            '#006837', // stop_output_6
                            70, // stop_input_6
                            '#004529'
                        ]
                    ],
                    'fill-extrusion-height': [ // Get fill-extrusion-height from the source Annual_Tons_Km2 property
                        "interpolate", [
                            "linear"
                        ], // change height as we zoom in (needs to find a standard for all 
                        ["zoom"],
                        0, ["*", ['get', 'Normalized_Percent_People_of_Color'],
                            2000
                        ], //This expression multiplies data value to determine height of polygon (need to fiddle with these)
                        13, .5
                    ],
                    'fill-extrusion-opacity': .9
                }
            },
            firstSymbolId
        );


        map.addLayer({
                'id': 'population_noHighSchool-extrusion',
                'type': 'fill-extrusion',
                'source': 'population_noHighSchool_data',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    // Get the fill-extrusion-color from the source color property.
                    'fill-extrusion-color': [
                        "case",
                        ['boolean', ["feature-state", 'clicked'],
                            false
                        ], // If the 'clicked' variable of a feature is true, then color
                        "orange",
                        ['==', ["get", "Normalized_Percent_Without_Diploma"], null], //color null values a certain color
                        '#cccecf',
                        ["step", ["get", "Normalized_Percent_Without_Diploma"], // else color step based on bins
                            '#f7fcf0', // stop_output_0
                            10, // stop_input_0
                            '#e0f3db', // stop_output_1
                            20, // stop_input_1
                            '#ccebc5', // stop_output_2
                            30, // stop_input_2
                            '#a8ddb5', // stop_output_3
                            40, // stop_input_3
                            '#7bccc4', // stop_output_4
                            50, // stop_input_4
                            '#4eb3d3', // stop_output_5
                            60, // stop_input_5
                            '#2b8cbe', // stop_output_6
                            70, // stop_input_6
                            '#08589e'
                        ]
                    ],
                    'fill-extrusion-height': [ // Get fill-extrusion-height from the source Count_ property
                        "interpolate", [
                            "linear"
                        ], // change height as we zoom in (needs to find a standard for all 
                        ["zoom"],
                        0, ["*", ['get', 'Normalized_Percent_Without_Diploma'],
                            2000
                        ], //This expression multiplies data value to determine height of polygon (need to fiddle with these)
                        13, .5
                    ],
                    'fill-extrusion-opacity': .9
                }
            },
            firstSymbolId
        );

        map.addLayer({
                'id': 'poverty-extrusion',
                'type': 'fill-extrusion',
                'source': 'poverty_data',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    // Get the fill-extrusion-color from the source color property.
                    'fill-extrusion-color': [
                        "case",
                        ['boolean', ["feature-state", 'clicked'],
                            false
                        ], // If the 'clicked' variable of a feature is true, then color
                        "#1cd4d0",
                        ['==', ["get", "Normalized_Percent_Living_in_Poverty"],
                            null
                        ], //color null values a certain color
                        '#cccecf',
                        ["step", ["get",
                                "Normalized_Percent_Living_in_Poverty"
                            ], // else color step based on bins
                            '#fff7f3', // stop_output_0
                            10, // stop_input_0
                            '#fde0dd', // stop_output_1
                            20, // stop_input_1
                            '#fcc5c0', // stop_output_2
                            30, // stop_input_2
                            '#fa9fb5', // stop_output_3
                            40, // stop_input_3
                            '#f768a1', // stop_output_4
                            50, // stop_input_4
                            '#dd3497', // stop_output_5
                            60, // stop_input_5
                            '#ae017e', // stop_output_6
                            70, // stop_input_6
                            '#7a0177'
                        ]
                    ],
                    'fill-extrusion-height': [ // Get fill-extrusion-height from the source Proximity_to_Heavy_Traffic_Road property
                        "interpolate", [
                            "linear"
                        ], // change height as we zoom in (needs to find a standard for all 
                        ["zoom"],
                        0, ["*", ['get', 'Normalized_Percent_Living_in_Poverty'],
                            2000
                        ], //This expression multiplies data value to determine height of polygon (need to fiddle with these)
                        13, .5
                    ],
                    'fill-extrusion-opacity': .9
                }
            },
            firstSymbolId
        );

        map.addLayer({
                'id': 'unaffordable-extrusion',
                'type': 'fill-extrusion',
                'source': 'unaffordable_data',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    // Get the fill-extrusion-color from the source color property.
                    'fill-extrusion-color': [
                        "case",
                        ['boolean', ["feature-state", 'clicked'],
                            false
                        ], // If the 'clicked' variable of a feature is true, then color
                        "#1cd4d0",
                        ['==', ["get", "Normalized_Percent"],
                            null
                        ], //color null values a certain color
                        '#cccecf',
                        ["step", ["get",
                                "Normalized_Percent"
                            ], // else color step based on bins
                            '#ffffe5', // stop_output_0
                            10, // stop_input_0
                            '#fff7bc', // stop_output_1
                            20, // stop_input_1
                            '#fee391', // stop_output_2
                            30, // stop_input_2
                            '#fec44f', // stop_output_3
                            40, // stop_input_3
                            '#fe9929', // stop_output_4
                            50, // stop_input_4
                            '#ec7014', // stop_output_5
                            60, // stop_input_5
                            '#cc4c02', // stop_output_6
                            70, // stop_input_6
                            '#8c2d04'
                        ]
                    ],
                    'fill-extrusion-height': [ // Get fill-extrusion-height from the source Average_RSEI_Concentrations property
                        "interpolate", [
                            "linear"
                        ], // change height as we zoom in (needs to find a standard for all 
                        ["zoom"],
                        0, ["*", ['get', 'Normalized_Percent'],
                            2000
                        ], //This expression multiplies data value to determine height of polygon (need to fiddle with these)
                        13, .5
                    ],
                    'fill-extrusion-opacity': .9,
                }
            },
            firstSymbolId
        );
        

        map.addLayer({
                'id': 'unemployed-extrusion',
                'type': 'fill-extrusion',
                'source': 'unemployed_data',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    // Get the fill-extrusion-color from the source color property.
                    'fill-extrusion-color': [
                        "case",
                        ['boolean', ["feature-state", 'clicked'],
                            false
                        ], // If the 'clicked' variable of a feature is true, then color
                        "#1cd4d0",
                        ['==', ["get", "Normalized_Unemployed_Percent"],
                            null
                        ], //color null values a certain color
                        '#cccecf',
                        ["step", ["get",
                                "Normalized_Unemployed_Percent"
                            ], // else color step based on bins
                            '#ffffe5', // stop_output_0
                            10, // stop_input_0
                            '#fff7bc', // stop_output_1
                            20, // stop_input_1
                            '#fee391', // stop_output_2
                            30, // stop_input_2
                            '#fec44f', // stop_output_3
                            40, // stop_input_3
                            '#fe9929', // stop_output_4
                            50, // stop_input_4
                            '#ec7014', // stop_output_5
                            60, // stop_input_5
                            '#cc4c02', // stop_output_6
                            70, // stop_input_6
                            '#8c2d04'
                        ]
                    ],
                    'fill-extrusion-height': [ // Get fill-extrusion-height from the source Average_RSEI_Concentrations property
                        "interpolate", [
                            "linear"
                        ], // change height as we zoom in (needs to find a standard for all 
                        ["zoom"],
                        0, ["*", ['get', 'Normalized_Unemployed_Percent'],
                            2000
                        ], //This expression multiplies data value to determine height of polygon (need to fiddle with these)
                        13, .5
                    ],
                    'fill-extrusion-opacity': .9,
                }
            },
            firstSymbolId
        );

        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right'); // add map controls
    });

    var current_layer = 'low_birth-extrusion'; // starting layer
    const current_layer_data = { // used to define the source of current layer
        'low_birth-extrusion': 'low_birth_data',
        'people_color-extrusion': 'people_color_data',
        'population_noHighSchool-extrusion': 'population_noHighSchool_data',
        'poverty-extrusion': 'poverty_data',
        'unaffordable-extrusion': 'unaffordable_data',
        'unemployed-extrusion': 'unemployed_data'
    };

    const current_layer_var = { //used to get the variable to be shown in popup
        'low_birth-extrusion': 'properties_Percent_Singleton_Live_Births',
        'people_color-extrusion': 'properties_Percent_People_of_Color',
        'population_noHighSchool-extrusion': 'properties_Percent_Without_Diploma',
        'poverty-extrusion': 'properties_Percent_Living_in_Poverty',
        'unaffordable-extrusion': 'properties_Percentage',
        'unemployed-extrusion': 'properties_Percent_Unemployed'
    };

    const current_layer_var_norm = { //used to get the normalized variable to be shown in popup
        'low_birth-extrusion': 'Normalized_Percent_Singleton_Live_Births',
        'people_color-extrusion': 'Normalized_Percent_People_of_Color',
        'population_noHighSchool-extrusion': 'Normalized_Percent_Without_Diploma',
        'poverty-extrusion': 'Normalized_Percent_Living_in_Poverty',
        'unaffordable-extrusion': 'Normalized_Percent',
        'unemployed-extrusion': 'Normalized_Unemployed_Percent'
    };

    const current_layer_var_text = { //Used in displaying variable names in popup window
        'low_birth-extrusion': 'Percentage of Low Birth Population:',
        'people_color-extrusion': 'Percentage of Population With Color:',
        'population_noHighSchool-extrusion': 'Percentage of Population With No High School Diploma :',
        'poverty-extrusion': 'Percentage of Population Living Under Poverty: ',
        'unaffordable-extrusion': 'Percentage of Households Spend More Than 30% of Their Income On Housing Cost:',
        'unemployed-extrusion': 'Percentage of Population That is Unemployed:'
    };

    map.on('idle', () => {

        var popups = document.getElementsByClassName("mapboxgl-popup");

        const toggleableLayerIds = ['low_birth-extrusion', 'people_color-extrusion',
            'population_noHighSchool-extrusion', 'poverty-extrusion', 'unaffordable-extrusion', 'unemployed-extrusion'
        ];

        const id_text = {
            'low_birth-extrusion': 'Low Birth Population',
            'people_color-extrusion': 'Proprotion of People of Color',
            'population_noHighSchool-extrusion': 'Population With No High School Diploma',
            'poverty-extrusion': 'Population With Poverty',
            'unaffordable-extrusion': 'Percentage of Unaffordable Households ',
            'unemployed-extrusion': 'Umemployed Population'
        };

        const popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true
        });

        // Fly to event + creates the list of locations one can 'fly to' within Washington state.
        d3.csv('assets/cities_list.csv').then(function (dataset) {
            dataset.forEach(function (d) {
                if (!document.getElementById(d.city)) {
                    const city_link = document.createElement('option');
                    city_link.id = d.city;
                    city_link.textContent = d.city;
                    city_link.className = 'inactive';
                    city_link.value = d.lat + "," + d.long;
                    city_link.onclick = function (x) {
                        const clickedCity = x.target.id;
                        let coord = x.target.value.split(',');

                        map.jumpTo({
                            center: [parseFloat(coord[0]), parseFloat(coord[1])],
                            zoom: 8.5,
                        });
                    }
                    const dropmenu = document.getElementById('myDropdown');
                    dropmenu.appendChild(city_link);
                }
            });

        });

        if (!map.getLayer('low_birth-extrusion') || !map.getLayer('people_color-extrusion') || !map.getLayer(
                'population_noHighSchool-extrusion') ||
            !map.getLayer('poverty-extrusion') || !map.getLayer(
                'unaffordable-extrusion') || !map.getLayer(
                'unemployed-extrusion')) {
            return;
        }

        // Set up the corresponding toggle button for each layer.
        for (const id of toggleableLayerIds) {
            // Skip layers that already have a button set up.
            if (document.getElementById(id)) {
                continue;
            }

            // Create a link.
            const link = document.createElement('a');
            link.id = id;
            link.href = '#';
            link.textContent = id_text[id];
            link.className = 'inactive';

            // Show or hide layer when the toggle is clicked.
            link.onclick = function (e) {
                const clickedLayer = this.id;
                // preventDefault() tells the user agent that if the event does not get explicitly handled, 
                // its default action should not be taken as it normally would be.
                e.preventDefault();
                // The stopPropagation() method prevents further propagation of the current event in the capturing 
                // and bubbling phases. It does not, however, prevent any default behaviors from occurring; 
                // for instance, clicks on links are still processed. If you want to stop those behaviors, 
                // see the preventDefault() method.
                e.stopPropagation();

                const visibility = map.getLayoutProperty(
                    clickedLayer,
                    'visibility'
                );

                for (var j = 0; j < toggleableLayerIds.length; j++) { //Sets layer visibility
                    if (clickedLayer === toggleableLayerIds[
                            j]) { //if layer clicked is the same as at current index of toggeable layers
                        layers.children[j].className = 'active'; //set as active css
                        map.setLayoutProperty(toggleableLayerIds[j], 'visibility',
                            'visible'); //set layer to visible
                        current_layer = toggleableLayerIds[j]; // set current layer for click highlight
                    } else {
                        layers.children[j].className = ''; //give default styling
                        map.setLayoutProperty(toggleableLayerIds[j], 'visibility',
                            'none'); //set layer to not visible
                    }
                }
            };
            // in the menu place holder, insert the layer links.
            const layers = document.getElementById('layer_menu');
            layers.appendChild(link);
        }

        var polygonID = null; //id of polygon clicked on

        map.on('click', current_layer, function (e) {
            if (e.features.length > 0) {
                if (typeof polygonID ===
                    'number') { // if the polygon id is no longer null (starting condition is null)
                    map.removeFeatureState({ //remove click feature state (no longer blue colored)
                        source: current_layer_data[current_layer],
                        id: polygonID
                    });
                }
                polygonID = e.features[0].id; // Get generated ID
                map.setFeatureState({ //set feature at polyon id to clicked=true, meaning it will become blue colored
                    source: current_layer_data[current_layer],
                    id: polygonID,
                }, {
                    clicked: true
                });
            }
        });

        map.on('styledata', () => { //whenever map layers change styling, only happens when layer visibility is changed
            popup.remove(); //remove all popups
            map.removeFeatureState({ //remove click feature state (no longer blue colored)
                source: current_layer_data[current_layer],
                id: polygonID
            });
            make_legend(current_layer)
        });

        map.on('click', current_layer, function (e) { //when a polygon is clicked on
            popup_close() //close all other popups
            popup.setLngLat(e.lngLat) //change popup location
            popup.setHTML(`<strong>Census Tract:</strong> #${e.features[0].properties.Census_Tract}<br> <strong>${current_layer_var_text[current_layer]}</strong> ${e.features[0].properties[current_layer_var[current_layer]]} <br> <strong>Normalized Value: </strong>${e.features[0].properties[current_layer_var_norm[current_layer]]}`)
            //change popup text
            popup.addTo(map); //add to map
        });

        function popup_close() { // this is a simple function that iterates through all popups and closes them
            for (var i = 0; i < popups.length; i++) {
                popups[i].remove();
            }
        }

    });



    const legend_breaks = [
        '0-9',
        '10-19',
        '20-29',
        '30-39',
        '40-49',
        '50-59',
        '60-69',
        '70+',
        'No data'
    ];

    const layer_colors = { //dictionary of each layer's color palette
        'low_birth-extrusion': [
            '#ffffcc', // stop_output_0
            '#ffeda0', // stop_output_1
            '#fed976', // stop_output_2
            '#feb24c', // stop_output_3
            '#fd8d3c', // stop_output_4
            '#fc4e2a', // stop_output_5
            '#e31a1c', // stop_output_6
            '#b10026',
            '#cccecf'
        ],
        'people_color-extrusion': [
            '#ffffe5', // stop_output_0
            '#d9f0a3', // stop_output_1
            '#addd8e', // stop_output_2
            '#78c679', // stop_output_3
            '#41ab5d', // stop_output_4
            '#238443', // stop_output_5
            '#006837', // stop_output_6
            '#004529',
            '#cccecf'
        ],
        'population_noHighSchool-extrusion': [
            '#f7fcfd', // stop_output_0
            '#e0ecf4', // stop_output_1
            '#bfd3e6', // stop_output_2
            '#9ebcda', // stop_output_3
            '#8c96c6', // stop_output_4
            '#8c6bb1', // stop_output_5
            '#88419d', // stop_output_6
            '#6e016b',
            '#cccecf'
        ],
        'poverty-extrusion': [
            '#f7fcf0', // stop_output_0
            '#e0f3db', // stop_output_1
            '#ccebc5', // stop_output_2
            '#a8ddb5', // stop_output_3
            '#7bccc4', // stop_output_4
            '#4eb3d3', // stop_output_5
            '#2b8cbe', // stop_output_6
            '#08589e',
            '#cccecf'
        ],
        'unaffordable-extrusion': [
            '#fff7f3', // stop_output_0
            '#fde0dd', // stop_output_1
            '#fcc5c0', // stop_output_2
            '#fa9fb5', // stop_output_3
            '#f768a1', // stop_output_4
            '#dd3497', // stop_output_5
            '#ae017e', // stop_output_6
            '#7a0177',
            '#cccecf'
        ],
        'unemployed-extrusion': [
            '#ffffe5', // stop_output_0
            '#fff7bc', // stop_output_1
            '#fee391', // stop_output_2
            '#fec44f', // stop_output_3
            '#fe9929', // stop_output_4
            '#ec7014', // stop_output_5
            '#cc4c02', // stop_output_6
            '#8c2d04',
            '#cccecf'
        ]
    };

    function make_legend(current_layer) { //when called, create legend, givin a layer
        const legend = document.getElementById('legend');
        legend.innerHTML = "<strong>Normalized " + current_layer_var_text[current_layer] + "</strong>";

        legend_breaks.forEach((layer, i) => {
            const color = layer_colors[current_layer][i];
            const item = document.createElement('div');
            const key = document.createElement('span');
            key.className = 'legend-key';
            key.style.backgroundColor = color;

            const value = document.createElement('span');
            value.innerHTML = `${layer}`;
            item.appendChild(key);
            item.appendChild(value);
            legend.appendChild(item);

        });
    }

    make_legend(current_layer) // create legend of default layer on initial load
    // MAP CODE ABOVE ONLY
} else if (page == 'index-page') {
    window.addEventListener('DOMContentLoaded', event => {

        // Activate Bootstrap scrollspy on the main nav element
        const mainNav = document.body.querySelector('#mainNav');
        if (mainNav) {
            new bootstrap.ScrollSpy(document.body, {
                target: '#mainNav',
                offset: 74,
            });
        };

        // Collapse responsive navbar when toggler is visible
        const navbarToggler = document.body.querySelector('.navbar-toggler');
        const responsiveNavItems = [].slice.call(
            document.querySelectorAll('#navbarResponsive .nav-link')
        );
        responsiveNavItems.map(function (responsiveNavItem) {
            responsiveNavItem.addEventListener('click', () => {
                if (window.getComputedStyle(navbarToggler).display !== 'none') {
                    navbarToggler.click();
                }
            });
        });

    });
}

// Side bar opening 
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.visibility = 'hidden';
    document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("main").style.visibility = 'visible';
}

// Drop menu toggle event for the fly to event
function menudrop() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Function for the search bar within the dropdown menu of the fly to event. Filters the list of locations
// based on the users input
function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("option");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}