# OntoUML Server

The **ontouml-server** project is an implementation of the *OntoUML as a Service* (OaaS) infrastructure. The server collects *model intelligence services* designed to be consumed by modeling tools supporting OntoUML.

* [Service Requesting](#Service-Requesting)
* [Available Services](#Available-Services)
* [Error Codes](#Available-Services)
* [Contact](#Contact)

## Service Requesting

The **ontouml-server** is available at [http://api.ontouml.org/](http://api.ontouml.org/) accepting HTTP POST requests for model intelligence service in the following format:

```HTTP
POST http://api.ontouml.org/<service-endpoint>
content-type: application/json

{
  "options": <service-options>,
  "project": <ontouml-project>
}
```

* `<service-endpoint>`: the URL endpoint assigned to the desired service;
* `<service-options>`: the options object containing arguments for the execution of the service. When options are not supported or the request should be executed with its default options, `"options"` should be assigned to `null`;
* `<ontouml-project>`: the OntoUML project to be processed serialized into JSON (see the [**ontouml-schema** project](https://github.com/OntoUML/ontouml-schema)).

Response messages to successful requests contain JSON objects with two fields, `"result"` and `"issues"`:

```HTTP
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Connection: close

{
  "result": <service-result>,
  "issues": <service-issues>
}
```

* `<service-result>`: the result to the service execution as defined by the specific service (i.e., it can be a string, an array, or an object, as defined in the service's implementation);
* `<service-issues>`: an array of issue objects that can be used by the service to inform the client of problems found during the service's execution.

See below a example request for the transformation of an OntoUML model into a gUFO-based OWL ontology:

```HTTP
POST http://api.ontouml.org/v1/transform/gufo
content-type: application/json

{
    "options": {
        "baseIri": "http://myontology.com"
    },
    "project": {
        "id" : "Pz4r2.6GAqACHQBO",
        "type" : "Project",
        "model" : {
            "id" : "Pz4r2.6GAqACHQBO_root",
            "type" : "Package",
            "contents" : [ {
                "id" : "mNir2.6GAqACHQWX",
                "name" : "Person",
                "type" : "Class",
                "stereotype" : "kind",
                "restrictedTo" : [ "functional-complex" ]
            } ]
        }
    }
}
```

The expected response for this request is presented in the following response:

```HTTP
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Connection: close

{
  "result": "@prefix : <http://myontology.com#>.\n@prefix gufo: <http://purl.org/nemo/gufo#>.\n@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.\n@prefix owl: <http://www.w3.org/2002/07/owl#>.\n@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.\n\n<http://myontology.com> rdf:type owl:Ontology;\n    owl:imports gufo:.\n:Person rdf:type owl:Class, gufo:Kind, owl:NamedIndividual;\n    rdfs:subClassOf gufo:FunctionalComplex;\n    rdfs:label \"Person\"@en.\n",
  "issues": []
}
```

## Available Services

* Model verification service
  * Description: service the checks for violation of OntoUML *semantically-motivated syntactical constraints* within the project's model.
  * Endpoint: [/v1/verify](http://api.ontouml.org/v1/verify)
  * Options: none

* Transformation to gUFO
  * Description: service that generates [gUFO-based](https://nemo-ufes.github.io/gufo/) OWL ontologies out of OntoUML models.
  * Endpoint: [/v1/transform/gufo](http://api.ontouml.org/v1/transform/gufo)

| Option | Description |
|---|---|
| "format" | a string informing the desired OWL syntax (e.g., "turtle", "n-triples", "n-quads") |
| "baseIri" | a string informing the desired base IRI  |
| "basePrefix" | a string informing a prefix to the individual IRIs |
| "uriFormatBy" | a string informing how IRIs should be constructed (i.e., based on element's "name" or "id") |
| "createObjectProperty" | a boolean flag for the creation of object properties |
| "createInverses" | a boolean flag for the creation of inverse object properties |
| "prefixPackages" | a boolean flag for the use of prefixes in package IRIs |
| "customElementMapping" | a object mapping element's IDs to custom labels and IRIs |
| "customPackageMapping" | a object mapping packages' IDs to custom labels and IRIs |

* Modularization service
  * Description: service that generates diagrams out of relational patterns identified in the model.
  * Endpoint: [/v1/modularize](http://api.ontouml.org/v1/modularize)
  * Options: none

## Error Codes

The **ontouml-server** project communicates with clients over HTTP requests where HTTP status codes are used to classify different types of errors.

| Error Code | Title | Description |
|---|---|---|
| 400 | Bad Request | The server received a mal-formed request (e.g., badly serialized OntoUML project) |
| 404 | Not Found | The desired service endpoint is not implemented |
| 500 | Internal Server Error | Some error occurred during the execution of the service; please inform the developers or open an issue |

## Contact

If you are interested to know more, feel free to open an issue to provide feedback on the project or reach our team members for more specific cases:

* [Claudenir M. Fonseca](https://github.com/claudenirmf)
* [Tiago Prince Sales](https://github.com/tgoprince)
