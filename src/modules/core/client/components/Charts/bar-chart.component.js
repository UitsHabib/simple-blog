import React from 'react';
import * as d3 from 'd3';

import useD3 from './d3.hook';

const defaultData = [
    { name: 'A', value: 0.2 },
    { name: 'B', value: 0.5 },
    { name: 'C', value: 0.8 }
];

function* ColorGenerator(colors) {
    const limit = colors.length;
    let i = 0 % limit;

    while (true) {
        yield colors[i];
        i = (i + 1) % limit;
        if (i < 0) break;
    }
}

const BarChart = ({
    data = defaultData,
    height = 400,
    width = 600,
    frameHeight = window.innerWidth < 576 ? 300 : 500,
    staticColor,
    colors = ["steelblue"],
    yTicks = 6
}) => {
    const ref = useD3(svg => {
        const margin = ({ top: 30, right: 0, bottom: 30, left: 40 });
        const rectColorGenerator = ColorGenerator(colors);
        const labelColorGenerator = ColorGenerator(colors);
        const labelFontSize = 14;
        const labelBottomMargin = 7;

        svg
            .selectAll('.bar-chart-value')
            .remove();

        svg
            .selectAll('.x-axis')
            .remove();

        svg
            .selectAll('.y-axis')
            .remove();

        svg
            .selectAll(".plot-area")
            .remove();

        const x = d3.scaleBand()
            .domain(d3.range(data.length))
            .range([margin.left, width - margin.right])
            .paddingInner(0.3)
            .paddingOuter(0.5);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)]).nice()
            .range([height - margin.bottom, margin.top]);

        const xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .attr("class", "x-axis")
            .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0));

        const yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .attr("class", "y-axis")
            .call(d3.axisLeft(y).ticks(yTicks))
            .call(m => m.select(".domain").remove())
            .call(h => h.append("text")
                .attr("x", -margin.left)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text(data.y));

        const getFillColor = (colorGenerator) => {
            if (staticColor) return staticColor;
            return colorGenerator.next().value;
        }

        svg.append("g")
            .attr("class", "plot-area")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("fill", (d, i) => getFillColor(rectColorGenerator))
            .attr("x", (d, i) => x(i))
            .attr("y", d => y(d.value))
            .attr("height", d => y(0) - y(d.value))
            .attr("width", x.bandwidth());

        // Show value
        svg
            .select("g")
            .selectAll("rect")
            .select((d, index, selectionGroup) => {
                const currentRect = d3.select(selectionGroup[index]);
                const value = d.value;
                const rectX = currentRect.attr("x");
                const rectY = currentRect.attr("y");

                svg
                    .select("g")
                    .append("text")
                    .text(value)
                    .attr('class', 'bar-chart-value')
                    .attr("fill", getFillColor(labelColorGenerator))
                    .attr("font-size", labelFontSize)
                    .attr("font-weight", "bold")
                    .attr("text-anchor", "middle")
                    .attr("x", +rectX + (x.bandwidth() / 2.0))
                    .attr("y", +rectY - labelBottomMargin)
            })

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        // Enlarge axis fonts
        svg
            .selectAll(".tick")
            .selectAll("text")
            .attr("font-size", 14)
            .attr("font-family", "Graphik Web,Helvetica Neue, Helvetica, Arial, Verdana, sans-serif")
    }, [data]);

    return (
        <svg
            ref={ref}
            viewBox={`0 0 ${width} ${height}`}
            className="bar-chart-area"
            style={{
                height: frameHeight,
                width: "100%",
                marginRight: "0px",
                marginLeft: "0px",
            }}
            viewBox={`0 0 ${width} ${height}`}
        >
        </svg>
    );
}

export default BarChart;
