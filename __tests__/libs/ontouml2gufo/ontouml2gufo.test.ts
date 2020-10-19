import { ModelManager, OntoUML2GUFO } from 'ontouml-js';
import { alpinebits } from './../../test_models';

describe('OntoUML Model', () => {
  it('Tests transformation accounting for ontological natures', async () => {
    const mm = new ModelManager(alpinebits);
    const service = new OntoUML2GUFO(mm);
    const result = await service.transformOntoUML2GUFO({
      baseIRI: 'https://example.com',
      format: 'N-Triple',
      uriFormatBy: 'name',
    });

    expect(
      result.model.includes(
        '<:Place> <rdfs:subClassOf> <gufo:FunctionalComplex> .',
      ),
    ).toBe(true);
  });
});
