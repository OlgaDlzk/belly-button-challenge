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
        Object.entries(metaResult).forEach(([key,value]) => {
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


        let yticks = otu_ids.slice(0,10).reverse().map(otuid => `OTU ${otuid}`);








        var trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
              size: sample_values,
              color: otu_ids,
            //   colorscale: "Earth"
            }
          };
          
          var bubbleData = [trace1];
          
          var bubbleLayout = {
            title: 'Marker Size',
            showlegend: false,
            // height: 600,
            // width: 600, 
            margin:{t:30, b:30, l:30, r:30}
          };
          
          Plotly.newPlot('bubble', bubbleData, bubbleLayout);



    })


}