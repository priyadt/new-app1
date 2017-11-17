export default dummyData = {
    "GetRequiredFieldsResponse": {
        "_errors": "",
        "keydata": {
            "EchoData": "15070422",
            "ClientId": "DEM",
            "ClientDealerId": "279011",
            "DTDealerId": "279011",
            "RequestDate": "2017-04-03T12:49:22.7317346-04:00",
            "ContractDate": "2017-03-30T00:00:00"
        },
        "Products": {
            "RequiredFieldResponseProduct": [
                {
                    "ClientProductId": "110540345",
                    "ProviderProductId": "",
                    "ProductTypeCode": "AP",
                    "ProviderId": "TWG",
                    "Fields": {
                        "Field": [
                            {
                                "ControlType": "Dropdown",
                                "Comment": "",
                                "Value": "None",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "None",
                                            "Desc": "None"
                                        },
                                        {
                                            "Code": "FMCC",
                                            "Desc": "Ford Motor Credit Corporation"
                                        },
                                        {
                                            "Code": "GMCC",
                                            "Desc": "Ally Financial"
                                        },
                                        {
                                            "Code": "TFS",
                                            "Desc": "Toyota Financial Services"
                                        },
                                        {
                                            "Code": "TMCC",
                                            "Desc": "Toyota Motor Credit Corp"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "lender_name",
                                "Caption": "Financing Source",
                                "DataType": "",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Financing"
                            },
                            {
                                "ControlType": "Calendar",
                                "Comment": "",
                                "Value": "03/30/2017",
                                "MaxLength": "",
                                "Required": "Y",
                                "Name": "in_service_date",
                                "Caption": "In Service Date",
                                "DataType": "Date",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Collateral"
                            },
                            {
                                "ControlType": "Dropdown",
                                "Comment": "",
                                "Value": "N",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "Y",
                                            "Desc": "Yes"
                                        },
                                        {
                                            "Code": "N",
                                            "Desc": "No"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "FirstOwner",
                                "Caption": "Second Owner",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Collateral"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "2017",
                                "MaxLength": "",
                                "Required": "Y",
                                "Name": "year",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "MERCEDES-BENZ",
                                "MaxLength": "30",
                                "Required": "Y",
                                "Name": "make",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "E 300",
                                "MaxLength": "30",
                                "Required": "Y",
                                "Name": "model",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "Dropdown",
                                "Comment": "",
                                "Value": "39-Complimentary Wrap",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "39-Complimentary Wrap",
                                            "Desc": "Complimentary Wrap"
                                        },
                                        {
                                            "Code": "38-Complimentary",
                                            "Desc": "Complimentary"
                                        },
                                        {
                                            "Code": "21-ThreeForOne Protection",
                                            "Desc": "ThreeForOne Protection"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "ap_contract_type",
                                "Caption": "Appearance Protection Contract Type",
                                "DataType": "",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Product"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "New",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "N",
                                            "Desc": "New"
                                        },
                                        {
                                            "Code": "U",
                                            "Desc": "Used"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "type",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "POLK",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
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
                                    ]
                                },
                                "Required": "Y",
                                "Name": "book_type",
                                "Caption": "Book Type",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "Dropdown",
                                "Comment": "",
                                "Value": "Personal",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
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
                                    ]
                                },
                                "Required": "Y",
                                "Name": "usage",
                                "Caption": "Usage",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "200",
                                "MaxLength": "11",
                                "Required": "Y",
                                "Name": "odometer",
                                "Caption": "",
                                "DataType": "Numeric",
                                "MaxValue": "99999999.99",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "WDDZF4JB6HA037689",
                                "MaxLength": "30",
                                "Required": "N",
                                "Name": "vin",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "Finance",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
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
                                    ]
                                },
                                "Required": "Y",
                                "Name": "deal_type",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Financing"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "GLOWTEST",
                                "MaxLength": "",
                                "Required": "Y",
                                "Name": "provider_dealer_id",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Product"
                            }
                        ]
                    },
                    "Errors": ""
                },
                {
                    "ClientProductId": "110540346",
                    "ProviderProductId": "",
                    "ProductTypeCode": "FPP",
                    "ProviderId": "TWG",
                    "Fields": {
                        "Field": [
                            {
                                "ControlType": "Dropdown",
                                "Comment": "",
                                "Value": "None",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "None",
                                            "Desc": "None"
                                        },
                                        {
                                            "Code": "FMCC",
                                            "Desc": "Ford Motor Credit Corporation"
                                        },
                                        {
                                            "Code": "GMCC",
                                            "Desc": "Ally Financial"
                                        },
                                        {
                                            "Code": "TFS",
                                            "Desc": "Toyota Financial Services"
                                        },
                                        {
                                            "Code": "TMCC",
                                            "Desc": "Toyota Motor Credit Corp"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "lender_name",
                                "Caption": "Financing Source",
                                "DataType": "",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Financing"
                            },
                            {
                                "ControlType": "Calendar",
                                "Comment": "",
                                "Value": "03/30/2017",
                                "MaxLength": "",
                                "Required": "Y",
                                "Name": "in_service_date",
                                "Caption": "In Service Date",
                                "DataType": "Date",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Collateral"
                            },
                            {
                                "ControlType": "RadioButton",
                                "Comment": "",
                                "Value": "N",
                                "MaxLength": "20",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "Y",
                                            "Desc": "Yes"
                                        },
                                        {
                                            "Code": "N",
                                            "Desc": "No"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "extended_eligibility",
                                "Caption": "Factory Certified Beyond Manufacturer",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Collateral"
                            },
                            {
                                "ControlType": "Dropdown",
                                "Comment": "",
                                "Value": "N",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "Y",
                                            "Desc": "Yes"
                                        },
                                        {
                                            "Code": "N",
                                            "Desc": "No"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "FirstOwner",
                                "Caption": "Second Owner",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Collateral"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "MERCEDES-BENZ",
                                "MaxLength": "30",
                                "Required": "Y",
                                "Name": "make",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "E 300",
                                "MaxLength": "30",
                                "Required": "Y",
                                "Name": "model",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "GLOWTEST",
                                "MaxLength": "",
                                "Required": "Y",
                                "Name": "provider_dealer_id",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Product"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "New",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "N",
                                            "Desc": "New"
                                        },
                                        {
                                            "Code": "U",
                                            "Desc": "Used"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "type",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "POLK",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
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
                                    ]
                                },
                                "Required": "Y",
                                "Name": "book_type",
                                "Caption": "Book Type",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "Dropdown",
                                "Comment": "",
                                "Value": "Personal",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
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
                                    ]
                                },
                                "Required": "Y",
                                "Name": "usage",
                                "Caption": "Usage",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "2017",
                                "MaxLength": "",
                                "Required": "Y",
                                "Name": "year",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "200",
                                "MaxLength": "11",
                                "Required": "Y",
                                "Name": "odometer",
                                "Caption": "",
                                "DataType": "Numeric",
                                "MaxValue": "99999999.99",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "Dropdown",
                                "Comment": "",
                                "Value": "38-Complimentary",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "39-Complimentary Wrap",
                                            "Desc": "Complimentary Wrap"
                                        },
                                        {
                                            "Code": "38-Complimentary",
                                            "Desc": "Complimentary"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "fpp_contract_type",
                                "Caption": "Luxcare Contract Type",
                                "DataType": "",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Product"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "Finance",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
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
                                    ]
                                },
                                "Required": "Y",
                                "Name": "deal_type",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Financing"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "WDDZF4JB6HA037689",
                                "MaxLength": "30",
                                "Required": "N",
                                "Name": "vin",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            }
                        ]
                    },
                    "Errors": ""
                },
                {
                    "ClientProductId": "110540344",
                    "ProviderProductId": "",
                    "ProductTypeCode": "PPM",
                    "ProviderId": "TWG",
                    "Fields": {
                        "Field": [
                            {
                                "ControlType": "Dropdown",
                                "Comment": "",
                                "Value": "None",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "None",
                                            "Desc": "None"
                                        },
                                        {
                                            "Code": "FMCC",
                                            "Desc": "Ford Motor Credit Corporation"
                                        },
                                        {
                                            "Code": "GMCC",
                                            "Desc": "Ally Financial"
                                        },
                                        {
                                            "Code": "TFS",
                                            "Desc": "Toyota Financial Services"
                                        },
                                        {
                                            "Code": "TMCC",
                                            "Desc": "Toyota Motor Credit Corp"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "lender_name",
                                "Caption": "Financing Source",
                                "DataType": "",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Financing"
                            },
                            {
                                "ControlType": "Calendar",
                                "Comment": "",
                                "Value": "03/30/2017",
                                "MaxLength": "",
                                "Required": "Y",
                                "Name": "in_service_date",
                                "Caption": "In Service Date",
                                "DataType": "Date",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Collateral"
                            },
                            {
                                "ControlType": "RadioButton",
                                "Comment": "",
                                "Value": "N",
                                "MaxLength": "20",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "Y",
                                            "Desc": "Yes"
                                        },
                                        {
                                            "Code": "N",
                                            "Desc": "No"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "extended_eligibility",
                                "Caption": "Factory Certified Beyond Manufacturer",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Collateral"
                            },
                            {
                                "ControlType": "Dropdown",
                                "Comment": "",
                                "Value": "N",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "Y",
                                            "Desc": "Yes"
                                        },
                                        {
                                            "Code": "N",
                                            "Desc": "No"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "FirstOwner",
                                "Caption": "Second Owner",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Collateral"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "MERCEDES-BENZ",
                                "MaxLength": "30",
                                "Required": "Y",
                                "Name": "make",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "E 300",
                                "MaxLength": "30",
                                "Required": "Y",
                                "Name": "model",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "GLOWTEST",
                                "MaxLength": "",
                                "Required": "Y",
                                "Name": "provider_dealer_id",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Product"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "New",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "N",
                                            "Desc": "New"
                                        },
                                        {
                                            "Code": "U",
                                            "Desc": "Used"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "type",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "POLK",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
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
                                    ]
                                },
                                "Required": "Y",
                                "Name": "book_type",
                                "Caption": "Book Type",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "Dropdown",
                                "Comment": "",
                                "Value": "Personal",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
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
                                    ]
                                },
                                "Required": "Y",
                                "Name": "usage",
                                "Caption": "Usage",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "2017",
                                "MaxLength": "",
                                "Required": "Y",
                                "Name": "year",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "200",
                                "MaxLength": "11",
                                "Required": "Y",
                                "Name": "odometer",
                                "Caption": "",
                                "DataType": "Numeric",
                                "MaxValue": "99999999.99",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "Dropdown",
                                "Comment": "",
                                "Value": "07-Standard",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "07-Standard",
                                            "Desc": "Standard"
                                        },
                                        {
                                            "Code": "63-Complimentary GM",
                                            "Desc": "Complimentary GM"
                                        },
                                        {
                                            "Code": "38-Complimentary",
                                            "Desc": "Complimentary"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "ppm_contract_type",
                                "Caption": "PPM Contract Type",
                                "DataType": "",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Product"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "Finance",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
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
                                    ]
                                },
                                "Required": "Y",
                                "Name": "deal_type",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Financing"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "WDDZF4JB6HA037689",
                                "MaxLength": "30",
                                "Required": "N",
                                "Name": "vin",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            }
                        ]
                    },
                    "Errors": ""
                },
                {
                    "ClientProductId": "110540347",
                    "ProviderProductId": "",
                    "ProductTypeCode": "CUL",
                    "ProviderId": "TWG",
                    "Fields": {
                        "Field": [
                            {
                                "ControlType": "Dropdown",
                                "Comment": "",
                                "Value": "None",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "None",
                                            "Desc": "None"
                                        },
                                        {
                                            "Code": "FMCC",
                                            "Desc": "Ford Motor Credit Corporation"
                                        },
                                        {
                                            "Code": "GMCC",
                                            "Desc": "Ally Financial"
                                        },
                                        {
                                            "Code": "TFS",
                                            "Desc": "Toyota Financial Services"
                                        },
                                        {
                                            "Code": "TMCC",
                                            "Desc": "Toyota Motor Credit Corp"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "lender_name",
                                "Caption": "Financing Source",
                                "DataType": "",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Financing"
                            },
                            {
                                "ControlType": "Calendar",
                                "Comment": "",
                                "Value": "03/30/2017",
                                "MaxLength": "",
                                "Required": "Y",
                                "Name": "in_service_date",
                                "Caption": "In Service Date",
                                "DataType": "Date",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Collateral"
                            },
                            {
                                "ControlType": "RadioButton",
                                "Comment": "",
                                "Value": "N",
                                "MaxLength": "20",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "Y",
                                            "Desc": "Yes"
                                        },
                                        {
                                            "Code": "N",
                                            "Desc": "No"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "extended_eligibility",
                                "Caption": "Factory Certified Beyond Manufacturer",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Collateral"
                            },
                            {
                                "ControlType": "Dropdown",
                                "Comment": "",
                                "Value": "N",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "Y",
                                            "Desc": "Yes"
                                        },
                                        {
                                            "Code": "N",
                                            "Desc": "No"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "FirstOwner",
                                "Caption": "Second Owner",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Collateral"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "MERCEDES-BENZ",
                                "MaxLength": "30",
                                "Required": "Y",
                                "Name": "make",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "E 300",
                                "MaxLength": "30",
                                "Required": "Y",
                                "Name": "model",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "GLOWTEST",
                                "MaxLength": "",
                                "Required": "Y",
                                "Name": "provider_dealer_id",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Product"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "New",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "N",
                                            "Desc": "New"
                                        },
                                        {
                                            "Code": "U",
                                            "Desc": "Used"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "type",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "POLK",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
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
                                    ]
                                },
                                "Required": "Y",
                                "Name": "book_type",
                                "Caption": "Book Type",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "Dropdown",
                                "Comment": "",
                                "Value": "Personal",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
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
                                    ]
                                },
                                "Required": "Y",
                                "Name": "usage",
                                "Caption": "Usage",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "2017",
                                "MaxLength": "",
                                "Required": "Y",
                                "Name": "year",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "200",
                                "MaxLength": "11",
                                "Required": "Y",
                                "Name": "odometer",
                                "Caption": "",
                                "DataType": "Numeric",
                                "MaxValue": "99999999.99",
                                "MinValue": "",
                                "Category": "Vehicle"
                            },
                            {
                                "ControlType": "Dropdown",
                                "Comment": "",
                                "Value": "38-Complimentary",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
                                        {
                                            "Code": "38-Complimentary",
                                            "Desc": "Complimentary"
                                        }
                                    ]
                                },
                                "Required": "Y",
                                "Name": "cul_contract_type",
                                "Caption": "PPM Complimentary Contract Type",
                                "DataType": "",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Product"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "Finance",
                                "MaxLength": "",
                                "FieldValues": {
                                    "FieldValue": [
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
                                    ]
                                },
                                "Required": "Y",
                                "Name": "deal_type",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Financing"
                            },
                            {
                                "ControlType": "NA",
                                "Comment": "",
                                "Value": "WDDZF4JB6HA037689",
                                "MaxLength": "30",
                                "Required": "N",
                                "Name": "vin",
                                "Caption": "",
                                "DataType": "Alphanumeric",
                                "MaxValue": "",
                                "MinValue": "",
                                "Category": "Vehicle"
                            }
                        ]
                    },
                    "Errors": ""
                }
            ]
        },
        "Errors": "",
        "ConsolidatedFields": "",
        "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "_xmlns:xsd": "http://www.w3.org/2001/XMLSchema"
    }
}