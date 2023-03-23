function main() {
  let selector = d3.select('#selDataset');
  // samples.json
  d3.json('samples.json').then((data) => {
    console.log(data);
    let sampleNames = data.names;
    sampleNames.forEach(element => {
      selector.append('option').text(element).property('value', element);

    });

    let firstSample = sampleNames[0];

    metaChart(firstSample);
    buildCharts(firstSample);
  })
}

main();


function optionChanged(newData) {
  metaChart(newData);
  buildCharts(newData);
}

function metaChart(sample) {
  d3.json('samples.json').then((data) => {
    let metaData = data.metadata;
    let metaArray = metaData.filter(sampleObj => sampleObj.id == sample);
    let metaResult = metaArray[0];
    let panel = d3.select('#sample-metadata');
    panel.html('');
    Object.entries(metaResult).forEach(([key, value]) => {
      panel.append('h5').text(`${key.toUpperCase()}: ${value}`);
    })
  })
}

function buildCharts(sample) {
  d3.json('samples.json').then((data) => {
    let metaData = data.metadata;
    let metaArray = metaData.filter(sampleObj => sampleObj.id == sample);
    let metaResult = metaArray[0];
    let wfreq = metaResult.wfreq;

    let sampleData = data.samples;
    let sampleArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    let sampleResult = sampleArray[0];

    let otu_ids = sampleResult.otu_ids;
    let otu_labels = sampleResult.otu_labels;
    let sample_values = sampleResult.sample_values;


    let yticks = otu_ids.slice(0, 10).reverse().map(otuid => `OTU ${otuid}`);

    // create bar chart

    var barData = [{
      type: 'bar',
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels,
      orientation: 'h'
    }];

    var barLayout = {
      width: 600,
      height: 500,
      margin: { t: 10, l: 120 }
    }

    Plotly.newPlot('bar', barData, barLayout);



    // create bubble chart

    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };

    var bubbleData = [trace1];

    var bubbleLayout = {
      showlegend: false,
      // height: 600,
      // width: 600
      margin: { t: 30, b: 30, l: 30, r: 30 },
      xaxis: {
        title: 'OTU ID'
      }

    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);


    // create gauge chart https://plotly.com/javascript/gauge-charts/

    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: wfreq,
      title: { text: "Belly Button Washing Frequency", font: { size: 20 } },
      gauge: {
        axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "gray" },
        bgcolor: "white",
        borderwidth: 1,
        bordercolor: "black",
        steps: [
          { range: [0, 2], color: "#FAD6A5" },
          { range: [2, 4], color: "#CFB997" },
          { range: [4, 6], color: "#7B8FA1" },
          { range: [6, 8], color: "#567189" },
          { range: [8, 10], color: "#495579" }],
      }
    }
    ];

    var layout = {
      width: 450,
      height: 350,
      margin: { t: 125, r: 25, l: 25, b: 25 },
      paper_bgcolor: "white",
      font: { color: "darkblue" }

    };

    Plotly.newPlot('gauge', gaugeData, layout);

    // gauge-pie chart with a needle 

    // var level = parseFloat(wfreq) * 20;


    // var degrees = 180 - level;
    // var radius = 0.5;
    // var radians = (degrees * Math.PI) / 180;
    // var x = radius * Math.cos(radians);
    // var y = radius * Math.sin(radians);


    // var mainPath = "M -.0 -0.05 L .0 0.05 L ";
    // var pathX = String(x);
    // var space = " ";
    // var pathY = String(y);
    // var pathEnd = " Z";
    // var path = mainPath.concat(pathX, space, pathY, pathEnd);

    // var data = [
    //   {
    //     type: "scatter",
    //     x: [0],
    //     y: [0],
    //     marker: { size: 12, color: "850000" },
    //     showlegend: false,
    //     name: "Freq",
    //     text: "",
    //     hoverinfo: "text+name"
    //   },
    //   {
    //     values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
    //     rotation: 90,
    //     text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
    //     textinfo: "text",
    //     textposition: "inside",
    //     marker: {
    //       colors: [
    //         "rgba(0, 105, 11, .5)",
    //         "rgba(10, 120, 22, .5)",
    //         "rgba(14, 127, 0, .5)",
    //         "rgba(110, 154, 22, .5)",
    //         "rgba(170, 202, 42, .5)",
    //         "rgba(202, 209, 95, .5)",
    //         "rgba(210, 206, 145, .5)",
    //         "rgba(232, 226, 202, .5)",
    //         "rgba(240, 230, 215, .5)",
    //         "rgba(255, 255, 255, 0)"
    //       ]
    //     },
    //     labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
    //     hoverinfo: "label",
    //     hole: 0.5,
    //     type: "pie",
    //     showlegend: false
    //   }
    // ];

    // var layout = {
    //   shapes: [
    //     {
    //       type: "path",
    //       path: path,
    //       fillcolor: "850000",
    //       line: {
    //         color: "850000"
    //       }
    //     }
    //   ],
    //   title: "<b>Belly Button Washing Frequency",
    //   height: 500,
    //   width: 500,
    //   xaxis: {
    //     zeroline: false,
    //     showticklabels: false,
    //     showgrid: false,
    //     range: [-1, 1]
    //   },
    //   yaxis: {
    //     zeroline: false,
    //     showticklabels: false,
    //     showgrid: false,
    //     range: [-1, 1]
    //   }
    // };

    // var gauge = document.getElementById("gauge");
    // Plotly.newPlot(gauge, data, layout);


  })
};