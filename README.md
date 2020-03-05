# OntoUML Server

This project is a proof of concept of the OntoUML Server, a web API designed to exposed functionalities for OntoUML models (e.g., automatic syntax verification and model transformation).

## Services

The OntoUML Sever is currently running at [http://api.ontouml.org/](http://api.ontouml.org/v1/) with the following services available:

- `v1/verify`: syntactical verification service for models in OntoUML 2. The request must contain the following characteristics:

  - HTTP Method **POST**: the endpoint process **POST** requests;
  - Content-Type Header: the `Content-Type` must be `application/json`
  - Request Body: the request body must be a JSON object that instantiates [`ontouml-schema`](https://github.com/OntoUML/ontouml-schema)

The following snippet exemplifies a request for the syntactical verification service:

```HTTP
POST /v1/verify HTTP/1.1
Content-Type: application/json

{
    "type": "Package",
    "id": "qJdeWA6AUB0UtAWl",
    "name": "serialization",
    "description": null,
    "contents": [
        {
            "type": "Class",
            "id": "qJdeWA6AUB0UtAWm",
            "name": "People",
            "description": null,
            "properties": null,
            "literals": null,
            "propertyAssignments": null,
            "stereotypes": [
                "kind"
            ],
            "isAbstract": false,
            "isDerived": false
        }
    ],
    "propertyAssignments": null
}
```

In successful requests, the server returns a status code `200 OK` with a `Content-Type: application/json` where the body an array of `VerificationIssue` objects.
Each `VerificationIssue` object may have an array of `VerificationAlternative` object that inform possible solutions for the container issue.
When no issues are detected, an empty array is returned.
The following snippet present response for the previous request:

```HTTP
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "code": "CLASS_PLURAL_NAME",
    "title": "Classes should not have plural names.",
    "description": "The class People should have its name in the singular form (Person).",
    "source": {
      "type": "Class",
      "id": "qJdeWA6AUB0UtAWm",
      "name": "People",
      "description": null,
      "properties": null,
      "literals": null,
      "propertyAssignments": null,
      "stereotypes": [
        "kind"
      ],
      "isAbstract": false,
      "isDerived": false
    },
    "context": null,
    "severity": "WARNING",
    "alternatives": [
      {
        "code": "ONTOUML_CLASS_NAME_TO_PLURAL",
        "title": "Change name to singular form.",
        "description": "Change name from People to Person.",
        "elements": null
      }
    ]
  }
]
```

The format of `VerificationIssue` and `VerificationAlternative` objects is defined by the [`ontouml-js`](https://github.com/OntoUML/ontouml-schema) project.

Unsuccessful requests may return one of the following responses:

 - **Body not conforming to `ontouml-schema` serialization**

 ```HTTP
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "status": "400",
  "message": "Invalid model input.",
  "errors": [ ... ]
}
```

 - **Internal Server Error**

 ```HTTP
HTTP/1.1 500 Internal Server Error
```

- `v1/transform/gufo`: transformation service of OntoUML 2 models into [gUFO](http://purl.org/nemo/doc/gufo) ontologies. The request must contain the following characteristics:

  - HTTP Method **POST**: the endpoint process **POST** requests
  - Content-Type Header: the `Content-Type` must be `application/json`
  - Request Body: the request body must be a JSON object that contains the following fields:

    - `options`: a JSON object that contains: a `baseIRI` string as the prefix for the ontology; a `uriFormatBy` string that is either `"name"` or `"id"` inform the desired formatting; and a `format` string that informs the desired syntax, i.e., either `N-Triples`, `N-Quad`, or `Turtle`
    - `model`: a JSON object that instantiates [`ontouml-schema`](https://github.com/OntoUML/ontouml-schema)

The following snippet exemplifies a request for the transformation service to gUFO:

```HTTP
POST /v1/transform/gUFO HTTP/1.1
Content-Type: application/json

{
    "options": {
        "baseIRI": "https://example.com",
        "format": "Turtle",
        "uriFormatBy": "id"
    },
    "model": {
        "type": "Package",
        "id": "qJdeWA6AUB0UtAWl",
        "name": "serialization",
        "description": null,
        "contents": [
            {
                "type": "Class",
                "id": "qJdeWA6AUB0UtAWm",
                "name": "Person",
                "description": null,
                "properties": null,
                "literals": null,
                "propertyAssignments": null,
                "stereotypes": [
                    "kind"
                ],
                "isAbstract": false,
                "isDerived": false
            }
        ],
        "propertyAssignments": null
    }
}
```

In successful requests, the server returns a status code `200 OK` with a `Content-Type` corresponding to [IANA Media Type](https://www.iana.org/assignments/media-types/media-types.xhtml#text) of the specified `format` option: `application/n-triples` for `"format": "N-Triples"`; `application/n-quads` for `"format": "N-Quads"`; and `text/turtle` for `"format": "Turtle"`.
The response body contains the output of the requested transformation.
The following snippet present response for the previous request:

```HTTP
HTTP/1.1 200 OK
Content-Type: text/turtle

@prefix : <https://example.com#>.
@prefix gufo: <http://purl.org/nemo/gufo#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix owl: <http://www.w3.org/2002/07/owl#>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.

<https://example.com> rdf:type owl:Ontology;
    owl:imports gufo:.
:qJdeWA6AUB0UtAWm rdf:type owl:Class, owl:NamedIndividual;
    rdfs:label "Person";
    rdfs:subClassOf gufo:FunctionalComplex;
    rdf:type gufo:Kind.
```

Unsuccessful requests may return one of the following responses:

 - **Body does not conform to the request specification**

 ```HTTP
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "status": 400,
  "message": "Malformed request"
}
```

 - **`model` does not conform to `ontouml-schema` serialization**

 ```HTTP
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "status": "400",
  "message": "Invalid model input.",
  "errors": [ ... ]
}
```

 - **`model` has issues of severity `ERROR` contains**

 ```HTTP
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "status": 400,
  "message": "Unable to transform model containing errors",
  "errors": [
    {
      "code": "CLASS_INVALID_ONTOUML_STEREOTYPE",
      "title": "No valid OntoUML stereotype.",
      "description": "The class Person must have a unique OntoUML stereotype.",
      "source": {
        "type": "Class",
        "id": "qJdeWA6AUB0UtAWm",
        "name": "Person",
        "description": null,
        "properties": null,
        "literals": null,
        "propertyAssignments": null,
        "stereotypes": [
          "invalid"
        ],
        "isAbstract": false,
        "isDerived": false
      },
      "context": null,
      "severity": "ERROR",
      "alternatives": [
        {
          "code": "REPLACE_ONTOUML_CLASS_STEREOTYPE",
          "title": "Replace element's stereotypes.",
          "description": "Apply to Person a unique stereotype from the set {kind, quantity, collective, subkind, role, phase, category, mixin, roleMixin, phaseMixin, relator, mode, quality, type, event, historicalRole, datatype, enumeration}.",
          "elements": null
        }
      ]
    }
  ]
}
```


 - **Internal Server Error**

```HTTP
HTTP/1.1 500 Internal Server Error
```


## Contact

If you are interested to know more, feel free to open an issue to provide feedback on the project or reach our team members for more specific cases:
 * [Claudenir M. Fonseca](https://github.com/claudenirmf)
 * [Tiago Prince Sales](https://github.com/tgoprince)
