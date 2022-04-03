import React, { useMemo } from 'react';
import * as d3 from 'd3';

import useD3 from './d3.hook';
import WorldMapGeoData from './worldLow.json';

function generateCountryValueMap(data, defaultValue = 0) {
    const map = new Map();

    WorldMapGeoData.features.forEach(feature => {
        const countryCode = feature.id;
        map.set(countryCode, defaultValue);
    });

    data.forEach(d => map.set(d.code, map.has(d.code)
        ? map.get(d.code) + d.value
        : d.value
    ));

    return map;
}

const getOffsetPosition = (element) => {
    const rect = element.getBoundingClientRect();

    const scrollTop = document.documentElement.scrollTop
        ? document.documentElement.scrollTop
        : document.body.scrollTop;

    const scrollLeft = document.documentElement.scrollLeft
        ? document.documentElement.scrollLeft
        : document.body.scrollLeft;

    const y = rect.top + scrollTop;
    const x = rect.left + scrollLeft;

    return { x, y };
}

const WorldMapChart = ({
    data = [],
    width = 600,
    height = window.innerWidth<576 ? 300:400,
    colorRange = ["#dddddd", "rgb(51,51,51)"]
}) => {
    const countryValue = useMemo(() => {
        return generateCountryValueMap(data);
    }, [data]);

    const ref = useD3(svg => {
        const min = 0;
        let max = d3.max(data, d => d.value);

        if (max === undefined || max === min) max = min + 100;

        // Define color scale
        const colorScale = d3
            .scaleLinear()
            .domain([min, max])
            .range(colorRange);

        // Create pathGenerator
        const projection = d3.geoMercator()
            .fitSize([width, height], WorldMapGeoData)
            .precision(100);

        const pathGenerator = d3
            .geoPath()
            .projection(projection);

        const getMousePosition = (e, svgElem) => {
            const svgElement = svgElem._groups[0][0];
            const offsetPosition = getOffsetPosition(svgElement);
            const x = e.pageX - offsetPosition.x;
            const y = e.pageY - offsetPosition.y;
            return { x, y };
        }

        function mouseOver(e, dataProps) {
            const { x, y } = getMousePosition(e, svg);
            const countryName = dataProps.properties.name;
            const value = countryValue.get(dataProps.id);

            const rectNode = svg
                .select(".details-tooltip")
                .attr("transform", `translate(${x},${y})`)
                .append("rect");

            rectNode
                .attr("width", 160)
                .attr("height", 40)
                .attr("rx", 4)
                .attr("fill", "black")
                .attr("fill-opacity", 0.45);

            const textNode = svg
                .select(".details-tooltip")
                .append("text");


            textNode.text(`${countryName}: ${value}`)
                .attr("fill", "white")
                .attr("text-anchor", "start")
                .attr("y", "25")
                .attr("x", "15")
                .attr("font-size", "14")

            const textNodeWidth = textNode.node().getBBox().width;
            const rectMargin = 30;

            rectNode.attr("width", textNodeWidth + rectMargin);
        }

        function mouseMove(e, dataGroup) {
            const { x, y } = getMousePosition(e, svg);
            svg.select(".details-tooltip")
                .attr("transform", `translate(${x}, ${y})`);
        }

        function mouseOut() {
            svg
                .select(".details-tooltip")
                .select("rect")
                .remove();
            svg
                .select(".details-tooltip")
                .select("text")
                .remove();
        }

        // draw the map and fill using the scale
        svg
            .select(".map-area")
            .selectAll(".country")
            .data(WorldMapGeoData.features)
            .join("path")
            .attr("class", "country")
            .attr("fill", feature => colorScale(countryValue.get(feature.properties.id)))
            .attr("d", feature => pathGenerator(feature))
            .on("mouseover", (e, d) => mouseOver(e, d))
            .on("mouseout", () => mouseOut())
            .on("mousemove", (e, d) => mouseMove(e, d));

    }, [data]);

    return (
        <svg
            ref={ref}
            viewBox={`0 0 ${width} ${height}`}
            style={{
                height: height,
                width: "100%",
                marginRight: "0px",
                marginLeft: "0px",
            }}
            viewBox={`0 0 ${width} ${height}`}
            data-testid='worldmap-chart-svg'
        >
            <g className="map-area" />
            <g className="details-tooltip" />
        </svg>
    );
}

export default WorldMapChart;
