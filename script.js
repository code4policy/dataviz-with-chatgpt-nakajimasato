let isExtendedChartVisible = false; // Variable to track the state of the chart

// Function to handle button click and toggle between normal and extended chart
function toggleChart() {
  isExtendedChartVisible = !isExtendedChartVisible;

  if (isExtendedChartVisible) {
    showExtendedChart();
    showReturnButton();
  } else {
    showNormalChart();
    showExtendedChartButton();
  }
}

// Function to show the extended chart
function showExtendedChart() {
  // Load data from the CSV file
  d3.csv('boston_311_2023_by_reason.csv').then(data => {
    // Log the loaded data to the console
    console.log("Loaded Data:", data);

    // Convert Count values to numbers
    data.forEach(d => {
      d.Count = +d.Count;
    });

    // Sort the data based on Count in descending order
    data.sort((a, b) => b.Count - a.Count);

    // Set up the SVG and its dimensions
    const svg = d3.select("#barchart1");
    const margin = { top: 40, right: 60, bottom: 150, left: 200 }; // Adjusted left margin
    const width = 1500 - margin.left - margin.right;
    const height = 630 - margin.top - margin.bottom;

    // Set up the X and Y scales
    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    // Set up the X and Y axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Append the SVG to the container
    svg.attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Map the data to the X and Y domains
    x.domain(data.map(d => d.reason)); // Use all data, not just top 10
    y.domain([0, d3.max(data, d => d.Count)]);

    // Append the X and Y axes
    svg.select(".x-axis").remove(); // Remove existing X-axis
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-80)")
      .style("font-size", "8px"); // Adjust font size

    svg.select(".y-axis").remove(); // Remove existing Y-axis
    svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "8px");

    // Append the bars with custom color
    svg.selectAll(".bar").remove(); // Remove existing bars
    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.reason))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.Count))
      .attr("height", d => height - y(d.Count))
      .attr("fill", "crimson"); // Change bar color to crimson
  });
}

// Function to show the normal chart (top 10 reasons)
function showNormalChart() {
  // Load data from the CSV file
  d3.csv('boston_311_2023_by_reason.csv').then(data => {
    // Log the loaded data to the console
    console.log("Loaded Data:", data);

    // Convert Count values to numbers
    data.forEach(d => {
      d.Count = +d.Count;
    });

    // Sort the data based on Count in descending order
    data.sort((a, b) => b.Count - a.Count);

    // Set up the SVG and its dimensions
    const svg = d3.select("#barchart1");
    const margin = { top: 40, right: 60, bottom: 150, left: 200 }; // Adjusted left margin
    const width = 1500 - margin.left - margin.right;
    const height = 630 - margin.top - margin.bottom;

    // Set up the X and Y scales
    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    // Set up the X and Y axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Append the SVG to the container
    svg.attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Map the data to the X and Y domains
    const top10Data = data.slice(0, 10);
    x.domain(top10Data.map(d => d.reason));
    y.domain([0, d3.max(top10Data, d => d.Count)]);

    // Append the X and Y axes
    svg.select(".x-axis").remove(); // Remove existing X-axis
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-60)")
      .style("font-size", "8px");

    // Add Y-axis label
    svg.append("text")
      .attr("transform", "rotate(-60)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "8px") // Adjusted font size
      .text("Number of Cases");

    // Append the bars with custom color
    svg.selectAll(".bar").remove(); // Remove existing bars
    svg.selectAll(".bar")
      .data(top10Data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.reason))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.Count))
      .attr("height", d => height - y(d.Count))
      .attr("fill", "crimson"); // Change bar color to crimson
  });
}

// Function to show the "Show Extended Chart" button
function showExtendedChartButton() {
  // Remove existing button container
  d3.select("#button-container").remove();

  const buttonContainer = d3.select("#chart-container").append("div").attr("id", "button-container");

  buttonContainer.append("button")
    .text("Show Extended Chart")
    .on("click", toggleChart);

  // Initial state: Show normal chart
  showNormalChart();
}

// Function to show the "Return" button
function showReturnButton() {
  // Remove existing button container
  d3.select("#button-container").remove();

  const buttonContainer = d3.select("#chart-container").append("div").attr("id", "button-container");

  buttonContainer.append("button")
    .text("Return")
    .on("click", toggleChart);
}

// Initial state: Show "Show Extended Chart" button
showExtendedChartButton();
