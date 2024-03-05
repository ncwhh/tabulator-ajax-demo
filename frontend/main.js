import {TabulatorFull as Tabulator} from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator_simple.min.css';

// Set min and max date for date range
fetch('/api/daterange')
    .then(response => response.json())
    .then(data => {
        document.getElementById('from_date').min = data.min_date;
        document.getElementById('until_date').min = document.getElementById('from_date').value
        document.getElementById('until_date').max = data.max_date;
    });

// handle date range change
document.getElementById('from_date').addEventListener('change', function () {
    document.getElementById('until_date').min = this.value;
    if (this.value > document.getElementById('until_date').value) {
        document.getElementById('until_date').value = this.value;
    }
});

// handle download button
document.getElementById('download').addEventListener('click', function () {
    tabulator_table.download("csv", "data.csv", {
        delimiter: ";"
    })
})

// handle update table button
document.getElementById('update').addEventListener('click', function () {
    tabulator_table.replaceData()
});

// Formatter for percentage with arrow
function localPercentWithArrow(cell, formatterParams, onRendered) {
    if (cell.getValue() === null) {
        return null
    }

    let value = Number(cell.getValue())
    let value_fmt = Number(value)
        .toLocaleString(undefined, {
            style: 'percent',
            minimumFractionDigits: 2
        });

    let icon = value === 0
        ? '<i style="color: gray" class="ti ti-arrow-right"></i>'
        : value > 0
            ? '<i style="color: green" class="ti ti-arrow-up-right"></i>'
            : '<i style="color: red" class="ti ti-arrow-down-right"></i>';

    return `<span style="display: flex; justify-content: space-between;">${icon} ${value_fmt}</span>`

}

// Formatter for integer with thousand separator
function localInt(cell, formatterParams, onRendered) {
    return Number(cell.getValue()).toLocaleString();
}

// Define columns
var columns = [
    {
        title: "Category",
        field: "category",
        headerFilter: "input",
        headerFilterLiveFilter: false,
        description: "Category of the product"
    },
    {
        title: "Product Name",
        field: "product_name",
        width: 150,
        headerFilter: "input",
        headerFilterLiveFilter: false,
        description: "Name of the product"
    },
    {
        title: "Impressions",
        field: "impressions",
        hozAlign: "right",
        formatter: localInt,
        description: "How many times the product was shown in search results"
    },
    {
        title: "Impressions Trend",
        field: "impressions_change",
        formatter: localPercentWithArrow,
        description: "How many times the product was shown in search results compared to the previous period in percentage"
    },
    {
        title: "Clicks",
        field: "clicks",
        hozAlign: "right",
        formatter: localInt,
        description: "How many times the product was clicked"
    },
    {
        title: "Clicks Trend",
        field: "clicks_change",
        formatter: localPercentWithArrow,
        description: "How many times the product was clicked compared to the previous period in percentage"
    },
    {
        title: "Add to carts",
        field: "add_to_cart",
        hozAlign: "right",
        formatter: localInt,
        description: "How many times the product was added to cart"
    },
    {
        title: "Add to carts Trend",
        field: "add_to_cart_change",
        formatter: localPercentWithArrow,
        description: "How many times the product was added to cart compared to the previous period in percentage"
    },
    {
        title: "Purchases",
        field: "purchases",
        hozAlign: "right",
        formatter: localInt,
        description: "How many times the product was purchased"
    },
    {
        title: "Purchases Trend",
        field: "purchases_change",
        formatter: localPercentWithArrow,
        description: "How many times the product was purchased compared to the previous period in percentage"
    }
]


//create tabulator on DOM element with id "example-table"
var tabulator_table = new Tabulator("#example-table", {
    ajaxURL: "/api/data",
    ajaxParams: () => {
        let from_date = document.getElementById("from_date").value
        let until_date = document.getElementById("until_date").value

        return {
            "from_date": from_date ? from_date : undefined,
            "until_date": until_date ? until_date : undefined
        };
    },
    ajaxURLGenerator: function (url, config, params) {
        return url + "?params=" + encodeURI(JSON.stringify(params)); //encode parameters as a json object
    },

    sortMode: "remote",
    filterMode: "remote",

    pagination: true,
    paginationMode: "remote",
    paginationSize: 10,
    paginationSizeSelector: [5, 10, 25, 50, 100, 1000],
    paginationCounter: "rows",

    height: 339,
    layout: "fitColumns",

    columns: columns,
    columnDefaults: {
        headerTooltip: function (e, column, onRendered) {
            let el = document.createElement("div");
            el.innerText = column.getDefinition().description;
            return el;
        },
    }
});

// Add column toggler
var columns_toggler = document.getElementById("columns_toggler");
columns_toggler.replaceChildren(
    ...columns.map(column => {
        var span = document.createElement("span");

        var input = document.createElement("input");
        input.setAttribute("id", column.field)
        input.setAttribute("type", "checkbox")
        input.setAttribute("name", column.title)
        input.setAttribute("value", column.field)
        input.checked = true
        input.addEventListener("change", function () {
            tabulator_table.toggleColumn(this.value)
        })


        var label = document.createElement("label");
        label.textContent = column.title
        label.setAttribute("for", column.field)

        span.appendChild(input);
        span.appendChild(label);
        return span
    })
)
