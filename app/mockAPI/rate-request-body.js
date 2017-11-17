export const data ={
   "_errors": [],
   "keydata": {
      "EchoData": "112233",
      "ClientId": "DEM",
      "ClientDealerId": "116627",
      "DTDealerId": "116627",
      "RequestDate": "\/Date(1472097614353)\/",
      "ContractDate": "\/Date(1472097614353)\/"
   },
    "Products": [
    {
      "ClientProductId": "",
      "Errors": [],
      "Fields": [
        {
          "Caption": "Aspiration Code",
          "Category": "Collateral",
          "Comment": "",
          "ControlType": "Dropdown",
          "DataType": "Alphanumeric",
          "FieldValues": [],
          "MaxLength": "6",
          "MaxValue": "",
          "MinValue": "",
          "Name": "aspiration_code",
          "Required": "Y",
          "Value": "N/A"
        },
        {
          "Caption": "Cylinders",
          "Category": "Collateral",
          "Comment": "",
          "ControlType": "Dropdown",
          "DataType": "Alphanumeric",
          "FieldValues": [],
          "MaxLength": "6",
          "MaxValue": "",
          "MinValue": "",
          "Name": "cylinders",
          "Required": "Y",
          "Value": "N/A"
        },
        {
          "Caption": "Driving Wheels",
          "Category": "Collateral",
          "Comment": "",
          "ControlType": "Dropdown",
          "DataType": "Alphanumeric",
          "FieldValues": [],
          "MaxLength": "20",
          "MaxValue": "",
          "MinValue": "",
          "Name": "driving_wheels",
          "Required": "Y",
          "Value": "N/A"
        },
        {
          "Caption": "Fuel Type",
          "Category": "Collateral",
          "Comment": "",
          "ControlType": "Dropdown",
          "DataType": "Alphanumeric",
          "FieldValues": [],
          "MaxLength": "6",
          "MaxValue": "",
          "MinValue": "",
          "Name": "fuel_type",
          "Required": "Y",
          "Value": "N/A"
        },
        {
          "Caption": "Segmentation Code",
          "Category": "Collateral",
          "Comment": "",
          "ControlType": "Dropdown",
          "DataType": "Alphanumeric",
          "FieldValues": [],
          "MaxLength": "6",
          "MaxValue": "",
          "MinValue": "",
          "Name": "segmentation_code",
          "Required": "Y",
          "Value": "N/A"
        },
        {
          "Caption": "Ton Rating",
          "Category": "Collateral",
          "Comment": "",
          "ControlType": "Dropdown",
          "DataType": "Alphanumeric",
          "FieldValues": [],
          "MaxLength": "10",
          "MaxValue": "",
          "MinValue": "",
          "Name": "ton_rating",
          "Required": "Y",
          "Value": "N/A"
        },
        {
          "Caption": "In Service Date",
          "Category": "Collateral",
          "Comment": "In Service Date is required for Maximum Mileage Vehicle Plans.",
          "ControlType": "Calendar",
          "DataType": "Date",
          "FieldValues": [],
          "MaxLength": "",
          "MaxValue": "",
          "MinValue": "",
          "Name": "in_service_date",
          "Required": "N",
          "Value": null
        },
        {
          "Caption": "Extended PowerTrain Warranty",
          "Category": "Collateral",
          "Comment": "",
          "ControlType": "RadioButton",
          "DataType": "",
          "FieldValues": [
            {
              "Code": "Y",
              "Desc": "Yes"
            },
            {
              "Code": "N",
              "Desc": "No"
            }
          ],
          "MaxLength": "",
          "MaxValue": "",
          "MinValue": "",
          "Name": "extended_power_train_warranty",
          "Required": "Y",
          "Value": "Y"
        },
        {
          "Caption": "Manufacture Certified",
          "Category": "Collateral",
          "Comment": "",
          "ControlType": "RadioButton",
          "DataType": "Alphanumeric",
          "FieldValues": [
            {
              "Code": "Y",
              "Desc": "Yes"
            },
            {
              "Code": "N",
              "Desc": "No"
            }
          ],
          "MaxLength": "",
          "MaxValue": "",
          "MinValue": "",
          "Name": "manufactured_certified",
          "Required": "Y",
          "Value": "N"
        },
        {
          "Caption": "Usage",
          "Category": "Vehicle",
          "Comment": "",
          "ControlType": "Dropdown",
          "DataType": "Alphanumeric",
          "FieldValues": [
            {
              "Code": "Personal",
              "Desc": "Personal"
            },
            {
              "Code": "Commercial",
              "Desc": "Commercial"
            },
            {
              "Code": "SnowPlow",
              "Desc": "SnowPlow"
            }
          ],
          "MaxLength": "",
          "MaxValue": "",
          "MinValue": "",
          "Name": "usage",
          "Required": "Y",
          "Value": "Personal"
        },
        {
          "Caption": "",
          "Category": "Vehicle",
          "Comment": "",
          "ControlType": "NA",
          "DataType": "Alphanumeric",
          "FieldValues": [],
          "MaxLength": "30",
          "MaxValue": "",
          "MinValue": "",
          "Name": "vin",
          "Required": "N",
          "Value": "WDDSJ5CB9GN366039"
        },
        {
          "Caption": "",
          "Category": "Vehicle",
          "Comment": "",
          "ControlType": "NA",
          "DataType": "Numeric",
          "FieldValues": [],
          "MaxLength": "11",
          "MaxValue": "99999999.99",
          "MinValue": "",
          "Name": "odometer",
          "Required": "Y",
          "Value": "100"
        },
        {
          "Caption": "",
          "Category": "Vehicle",
          "Comment": "",
          "ControlType": "NA",
          "DataType": "Alphanumeric",
          "FieldValues": [],
          "MaxLength": "",
          "MaxValue": "",
          "MinValue": "",
          "Name": "year",
          "Required": "Y",
          "Value": "2016"
        },
        {
          "Caption": "",
          "Category": "Financing",
          "Comment": "",
          "ControlType": "NA",
          "DataType": "Alphanumeric",
          "FieldValues": [
            {
              "Code": "Finance",
              "Desc": "Finance"
            },
            {
              "Code": "Lease",
              "Desc": "Lease"
            },
            {
              "Code": "Balloon",
              "Desc": "Balloon"
            },
            {
              "Code": "Cash",
              "Desc": "Cash"
            }
          ],
          "MaxLength": "",
          "MaxValue": "",
          "MinValue": "",
          "Name": "deal_type",
          "Required": "Y",
          "Value": "Finance"
        },
        {
          "Caption": "",
          "Category": "Vehicle",
          "Comment": "",
          "ControlType": "NA",
          "DataType": "Alphanumeric",
          "FieldValues": [],
          "MaxLength": "30",
          "MaxValue": "",
          "MinValue": "",
          "Name": "model",
          "Required": "Y",
          "Value": "CLA 45 AMG"
        },
        {
          "Caption": "",
          "Category": "Product",
          "Comment": "",
          "ControlType": "NA",
          "DataType": "Alphanumeric",
          "FieldValues": [],
          "MaxLength": "",
          "MaxValue": "",
          "MinValue": "",
          "Name": "provider_dealer_id",
          "Required": "Y",
          "Value": ""
        },
        {
          "Caption": "",
          "Category": "Vehicle",
          "Comment": "",
          "ControlType": "NA",
          "DataType": "Alphanumeric",
          "FieldValues": [
            {
              "Code": "N",
              "Desc": "New"
            },
            {
              "Code": "U",
              "Desc": "Used"
            }
          ],
          "MaxLength": "",
          "MaxValue": "",
          "MinValue": "",
          "Name": "type",
          "Required": "Y",
          "Value": "N"
        },
        {
          "Caption": "Book Type",
          "Category": "Vehicle",
          "Comment": "",
          "ControlType": "NA",
          "DataType": "Alphanumeric",
          "FieldValues": [
            {
              "Code": "NADA",
              "Desc": "NADA"
            },
            {
              "Code": "CHROME",
              "Desc": "CHROME"
            },
            {
              "Code": "POLK",
              "Desc": "POLK"
            }
          ],
          "MaxLength": "",
          "MaxValue": "",
          "MinValue": "",
          "Name": "book_type",
          "Required": "Y",
          "Value": "POLK"
        },
        {
          "Caption": "",
          "Category": "Vehicle",
          "Comment": "",
          "ControlType": "NA",
          "DataType": "Alphanumeric",
          "FieldValues": [],
          "MaxLength": "30",
          "MaxValue": "",
          "MinValue": "",
          "Name": "make",
          "Required": "Y",
          "Value": "MERCEDES-BENZ"
        }
      ],
      "ProductTypeCode": "VSC",
      "ProviderId": "APC",
      "ProviderProductId": ""
    },
    {
      "ClientProductId": "",
      "Errors": [],
      "Fields": [
        {
          "Caption": "Amount Financed",
          "Category": "Financing",
          "Comment": "",
          "ControlType": "Textbox",
          "DataType": "Numeric",
          "FieldValues": [],
          "MaxLength": "11",
          "MaxValue": "99999999.99",
          "MinValue": "0",
          "Name": "amount_financed",
          "Required": "Y",
          "Value": "23000"
        },
        {
          "Caption": "Finance Term(Months)",
          "Category": "Financing",
          "Comment": "",
          "ControlType": "Textbox",
          "DataType": "Numeric",
          "FieldValues": [],
          "MaxLength": "11",
          "MaxValue": "99999999.99",
          "MinValue": "0",
          "Name": "finance_term",
          "Required": "Y",
          "Value": "60"
        },
        {
          "Caption": "APR",
          "Category": "Financing",
          "Comment": "",
          "ControlType": "Textbox",
          "DataType": "Numeric",
          "FieldValues": [],
          "MaxLength": "11",
          "MaxValue": "99999999.99",
          "MinValue": "0",
          "Name": "apr",
          "Required": "Y",
          "Value": "6.0"
        },
        {
          "Caption": "",
          "Category": "Vehicle",
          "Comment": "",
          "ControlType": "NA",
          "DataType": "Alphanumeric",
          "FieldValues": [],
          "MaxLength": "",
          "MaxValue": "",
          "MinValue": "",
          "Name": "year",
          "Required": "Y",
          "Value": "2016"
        },
        {
          "Caption": "",
          "Category": "Vehicle",
          "Comment": "",
          "ControlType": "NA",
          "DataType": "Alphanumeric",
          "FieldValues": [],
          "MaxLength": "30",
          "MaxValue": "",
          "MinValue": "",
          "Name": "make",
          "Required": "Y",
          "Value": "MERCEDES-BENZ"
        },
        {
          "Caption": "",
          "Category": "Vehicle",
          "Comment": "",
          "ControlType": "NA",
          "DataType": "Alphanumeric",
          "FieldValues": [],
          "MaxLength": "30",
          "MaxValue": "",
          "MinValue": "",
          "Name": "model",
          "Required": "Y",
          "Value": "AMG 45 CLA"
        },
        {
          "Caption": "Finance Term 2(Months)",
          "Category": "Financing",
          "Comment": "",
          "ControlType": "Textbox",
          "DataType": "Numeric",
          "FieldValues": [],
          "MaxLength": "11",
          "MaxValue": "99999999.99",
          "MinValue": "0",
          "Name": "finance_term2",
          "Required": "N",
          "Value": null
        },
        {
          "Caption": "",
          "Category": "Vehicle",
          "Comment": "",
          "ControlType": "NA",
          "DataType": "Alphanumeric",
          "FieldValues": [
            {
              "Code": "N",
              "Desc": "New"
            },
            {
              "Code": "U",
              "Desc": "Used"
            }
          ],
          "MaxLength": "",
          "MaxValue": "",
          "MinValue": "",
          "Name": "type",
          "Required": "Y",
          "Value": "N"
        },
        {
          "Caption": "Book Type",
          "Category": "Vehicle",
          "Comment": "",
          "ControlType": "NA",
          "DataType": "Alphanumeric",
          "FieldValues": [
            {
              "Code": "NADA",
              "Desc": "NADA"
            },
            {
              "Code": "CHROME",
              "Desc": "CHROME"
            },
            {
              "Code": "POLK",
              "Desc": "POLK"
            }
          ],
          "MaxLength": "",
          "MaxValue": "",
          "MinValue": "",
          "Name": "book_type",
          "Required": "Y",
          "Value": "POLK"
        },
        {
          "Caption": "Usage",
          "Category": "Vehicle",
          "Comment": "",
          "ControlType": "Dropdown",
          "DataType": "Alphanumeric",
          "FieldValues": [
            {
              "Code": "Personal",
              "Desc": "Personal"
            },
            {
              "Code": "Commercial",
              "Desc": "Commercial"
            },
            {
              "Code": "SnowPlow",
              "Desc": "SnowPlow"
            }
          ],
          "MaxLength": "",
          "MaxValue": "",
          "MinValue": "",
          "Name": "usage",
          "Required": "Y",
          "Value": "Personal"
        },
        {
          "Caption": "",
          "Category": "Vehicle",
          "Comment": "",
          "ControlType": "NA",
          "DataType": "Numeric",
          "FieldValues": [],
          "MaxLength": "11",
          "MaxValue": "99999999.99",
          "MinValue": "",
          "Name": "odometer",
          "Required": "Y",
          "Value": "100"
        },
        {
          "Caption": "",
          "Category": "Vehicle",
          "Comment": "",
          "ControlType": "NA",
          "DataType": "Alphanumeric",
          "FieldValues": [],
          "MaxLength": "30",
          "MaxValue": "",
          "MinValue": "",
          "Name": "vin",
          "Required": "N",
          "Value": "WDDSJ5CB9GN366039"
        },
        {
          "Caption": "",
          "Category": "Financing",
          "Comment": "",
          "ControlType": "NA",
          "DataType": "Alphanumeric",
          "FieldValues": [
            {
              "Code": "Finance",
              "Desc": "Finance"
            },
            {
              "Code": "Lease",
              "Desc": "Lease"
            },
            {
              "Code": "Balloon",
              "Desc": "Balloon"
            },
            {
              "Code": "Cash",
              "Desc": "Cash"
            }
          ],
          "MaxLength": "",
          "MaxValue": "",
          "MinValue": "",
          "Name": "deal_type",
          "Required": "Y",
          "Value": "Finance"
        },
        {
          "Caption": "",
          "Category": "Product",
          "Comment": "",
          "ControlType": "NA",
          "DataType": "Alphanumeric",
          "FieldValues": [],
          "MaxLength": "",
          "MaxValue": "",
          "MinValue": "",
          "Name": "provider_dealer_id",
          "Required": "Y",
          "Value": ""
        }
      ],
      "ProductTypeCode": "GAP",
      "ProviderId": "ZDU",
      "ProviderProductId": ""
    }
  ],
   "Errors": [],
   "ConsolidatedFields": []
};
