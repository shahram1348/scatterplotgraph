// Scatter Plot Gragh project for freecodecamp lessons. By Shahram Motaghiani
const color = d3.scaleOrdinal(d3.schemeCategory10);

let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const w = 1000;
const h = 500;

const padding = 40;
const radius = 6;



const div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .attr('id', 'tooltip')
  .style('opacity', 0);

const tooltip = d3.select('#tooltip');



  const svg = d3
  .select('body')
  .append('svg')
  .attr('width', w + padding + padding)
  .attr('height', h + padding + padding)
  .attr('class', 'graph')
  .append('g')
  .attr('transform', 'translate(' + padding + ',' + padding + ')');

  svg
.append('text')
.attr('id', 'title')
.attr('x', w / 2)
.attr('y', 0)
.attr('text-anchor', 'middle')
.style('font-size', '30px')
.text('Scatter Plot Graph of Cyclists doping test');

  // Getting data as json file then convert it to array
  const req = new XMLHttpRequest();
  req.open("GET", url, true);

  req.onload = () => {
    const dataset = JSON.parse(req.responseText)
    console.log(dataset);

    const newDataset = dataset.map( (d) => {
      const parsedTime = d.Time.split(':');
      //console.log("parsedTime = " , parsedTime);
        d.Time = new Date(1970, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1]);
      //console.log(d.Time);
      });

  // Define x and y domains:
const widthScale = d3
                .scaleLinear()
                .domain([d3.min(dataset, (d) => d.Year) - 1 , d3.max(dataset, (d) => d.Year) + 1])//.domain([newDataset[0][0], newDataset[newDataset.length - 1][0]])
                .range([padding, w - padding]);
    //hightScale 
   
const heightScale = d3
                .scaleTime()
                .domain([d3.min(dataset, (d) => d.Time), d3.max(dataset, (d) => d.Time)])//.domain([newDataset[0][0], newDataset[newDataset.length - 1][0]])
                .range([ padding , h - padding]);
 
const xAxis = d3.axisBottom(widthScale).tickFormat(d3.format("d"));
const yAxis = d3.axisLeft(heightScale).tickFormat(d3.timeFormat("%M:%S"));

svg.append("g")
.attr('id', "x-axis") 
.attr("transform", "translate(0," + (h - padding) + ")")
.call(xAxis);

svg.append("g")
.attr('id', "y-axis") 
.attr("transform", "translate(" + padding + ", 0)")
.call(yAxis);


svg.selectAll('.dot')
  .data(dataset)
  .enter()
  .append('circle')
  .attr('class', 'dot')
  .attr('data-xvalue', (d) => d.Year)
  .attr('data-yvalue', (d) => d.Time.toISOString())
  .attr('r', radius)
  .attr('cy', (d) => heightScale(d.Time))
  .attr('cx', (d) => widthScale(d.Year))
  .style('fill', (d) => color(d.Doping ? 1 : 0))
.on('mouseover', function (event, d) {
    tooltip.style('opacity', 0.9);
    tooltip.attr('data-year', d.Year);
    tooltip
      .html(
        d.Name + ': ' + d.Nationality + '<br />'  + d.Doping)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px');
  })
  .on('mouseout', function () {
    tooltip.style('opacity', 0);
  });
const legendContainer = svg.append('g').attr('id', 'legend');

const legend = legendContainer.selectAll('#legend')
.data(color.domain())
.enter()
.append('g')
.attr('class', 'legend-label')
.attr('transform', (d, i) => {
  return 'translate(0,' + (h/2 - i * 20) + ')';});
  legend
  .append('rect')
  .attr('x', w - 18)
  .attr('width', 18)
  .attr('height', 18)
  .style('fill', color);

legend
  .append('text')
  .attr('x', w - 24)
  .attr('y', 9)
  .attr('dy', '.35em')
  .style('text-anchor', 'end')
  .text( (d) => {
    if (d) {
      return 'Riders with doping allegations';
    } else {
      return 'No doping allegations';
    }
  });

    };
req.send();
