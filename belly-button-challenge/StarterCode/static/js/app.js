// Getting the data
let link = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(link).then(function(data) {
    console.log(data);
  });


let barTrace;
let bubbleTrace;

// Bar chart
function barchart(value) {
    d3.json(link).then((data) => {
        let sample = data.samples;
        let value_filtered = sample.filter(sample_value => sample_value.id == value);
        let result = value_filtered[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        console.log("Bar Chart Data:", otu_ids, otu_labels, sample_values);

        let y = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let x = sample_values.slice(0,10).reverse();
        let labs = otu_labels.slice(0,10).reverse();

        console.log(x, y, labs);

        let trace = {
            x: x,
            y: y,
            text: labs,
            type: "bar",
            orientation: "h"
        };

     
        if (!barTrace) {
            barTrace = trace;
            Plotly.newPlot("bar", [barTrace]);
        } else {
           
            Plotly.update("bar", [trace]);
        }
    });
}

// bubble chart
function bubblechart(value) {
    d3.json(link).then((data) => {
        let sample = data.samples;
        let value_filtered = sample.filter(sample_value => sample_value.id == value);
        let result = value_filtered[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        console.log("Bubble Chart Data:", otu_ids, otu_labels, sample_values);

        let trace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
            }
        };

     
        if (!bubbleTrace) {
            bubbleTrace = trace;
            Plotly.newPlot("bubble", [bubbleTrace]);
        } else {
          
            Plotly.update("bubble", [trace]);
        }
    });
}

// Demographics information
function demographics(value) {
    d3.json(link).then((data) => {
        let metadata = data.metadata;
        let Metadata_Filtered = metadata.filter(meta_value => meta_value.id == value);
        let result = Metadata_Filtered[0]
        d3.select("#sample-metadata").html("");

        Object.entries(result).forEach(([key, value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        })
    })
}

function dashboard_init() {
    let dropDown = d3.select("#selDataset");

    d3.json(link).then((data) => {
        let names = data.names;
        
        names.forEach((x) => {
            dropDown.append("option").text(x).property("value", x);
        });

      
        dropDown.on("change", function () {
            const selectedValue = this.value;
            optionChanged(selectedValue);
        });

        let id = names[0];
        demographics(id);
        barchart(id);
        bubblechart(id);
    });
}

// updating values
function optionChanged(value) {
    demographics(value);
    barchart(value);
    bubblechart(value);
}

dashboard_init();