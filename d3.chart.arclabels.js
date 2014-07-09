/*!
 * @copyright Copyright (c) 2014 Sentient Energy, Inc.
 * @license   Licensed under MIT license
 */
(function (d3) {
    /**
     * Arc labels control for the d3.chart framework.
     *
     * Renders a set of labels around an arc. This control is
     * designed to be used as a mix-in component to a parent
     * chart.
     *
     * __Basic usage__
     *
     * ```javascript
     * chart.arcLabelsChart = chart.append("g").chart("ArcLabels")
     *                                         .text(textFunction)
     *                                         .arc(arc);
     * ```
     *
     * @class ArcLabels
     * @namespace d3.chart
     * @extends d3.chart.BaseChart
     * @author Pete Baker
     * @version 0.1.0
     */
    d3.chart("BaseChart").extend("ArcLabels", {

        /**
         * Initializes the chart.
         *
         * Creates and configures a new arc labels layer.
         *
         * @constructor
         * @method initialize
         */
        initialize: function() {
            //set up the local chart element
            var chart = this;
            chart.labelsArea = this.base.classed("labels", true);

            //set the default text element offset value to 1.
            chart._em = 1;

            //set the default text mapping to the identity function
            chart._text = function(d) { return d; };

            //create the arc
            chart._arc = d3.svg.arc();

            //create a new labels layer
            chart.layer("labels", chart.labelsArea, {
                //binds chart data to graphic elements
                dataBind: function(data) {
                    console.log("[ArcLabels dataBind]");
                    chart.data = data;

                    return this.selectAll("g").data(data);
                },
                //inserts a new label for each datum, setting the dy offset
                insert: function() {
                    console.log("[ArcLabels insert]");

                    var g = this.append("g").classed("l", true);
                    g.append("path")
                     .attr("id", function(d, i) { return "a"+i; });    //set the ID of the path

                    return g.append("text")
                            .attr("dy", "1em")
                            .append("textPath")
                            .attr("class", "textpath")    //webkit bug requires adding class for selection
                            .attr("xlink:href", function(d,i) { return "#a" + i; })    //link to the path ID
                            .attr("startOffset", function(d,i) { return 0.25; });
                },
                events: {
                    //writes text element values on insert or update
                    //uses the chart._text function / value
                    "merge:transition": function() {
                        //can't select "textPath" elements - must select by class.
                        //http://bl.ocks.org/mbostock/3151228
                        this.select(".textpath").text(chart._text);
                        this.select("path").attr("d", chart._arc);
                    }
                }
            });
        },
        /**
         * Sets the text value or function for each text element.
         *
         * If the `text` parameter is not supplied, the existing `text` value
         * is returned.
         *
         * @method text
         * @param {String|Function} [text] a new text String or Function
         * to be applied to all elements.
         * @return {String|Function|this} the chart instance (for method chaining), or `text`.
         */
        text: function(text) {
            if (!arguments.length) return this._text;

            this._text = text;

            return this;
        },
        /**
         * Sets or gets the arc object.
         *
         * If `arc` is not supplied, the existing `arc`
         * is returned.
         *
         * @method arc
         * @param {d3.svg.arc} [arc] A d3 SVG arc object
         * @return {d3.svg.arc|this} the chart instance (for method chaining), or `arc`.
         */
        arc: function(arc) {
            if (!arguments.length) return this._arc;

            this._arc = arc;

            return this;
        }
    });
}(d3));