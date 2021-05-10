import { Project } from 'ontouml-js';
import { post } from '../utils';

describe('Test responses to models on different routes', () => {
  describe('Test type patterns', () => {
    const project = new Project({ id: 'type patterns' });
    const model = project.createModel();
    const personType = model.createType('Person Type');
    const person = model.createKind('Person');

    personType.isPowertype = true;
    personType.order = 2;

    model.createInstantiationRelation(person, personType);

    it('Should return 200 on /v1/verify', async () => {
      const response = await post('/v1/verify', { project, options: null });
      expect(response.status).toBe(200);
    });
    it('Should return 200 on /v1/transform/gufo', async () => {
      const response = await post('/v1/transform/gufo', { project, options: null });
      expect(response.status).toBe(200);
    });
    it('Should return 200 on /v1/modularize', async () => {
      const response = await post('/v1/modularize', { project, options: null });
      expect(response.status).toBe(200);
    });
  });

  describe('Test object patterns', () => {
    const project = new Project({ id: 'object patterns' });
    const model = project.createModel();

    const car = model.createKind('Car');
    const engine = model.createKind('Engine');
    const wheel = model.createKind('Wheel');
    const truck = model.createSubkind('Truck');
    const coupe = model.createSubkind('Coupé');
    const rentalCar = model.createRole('Rental Car');
    const famousCar = model.createHistoricalRole('Famous Car');
    const underMaintenance = model.createPhase('Under Maintenance');
    const roadReadyCondition = model.createPhase('Road Ready Condition');

    model.createComponentOfRelation(engine, car);
    model.createComponentOfRelation(wheel, car);

    model.createGeneralization(car, truck);
    model.createGeneralization(car, coupe);
    model.createGeneralization(car, rentalCar);
    model.createGeneralization(car, famousCar);
    const genPhase1 = model.createGeneralization(car, underMaintenance);
    const genPhase2 = model.createGeneralization(car, roadReadyCondition);

    model.createPartition([genPhase1, genPhase2]);

    it('Should return 200 on /v1/verify', async () => {
      const response = await post('/v1/verify', { project, options: null });
      expect(response.status).toBe(200);
    });
    it('Should return 200 on /v1/transform/gufo', async () => {
      const response = await post('/v1/transform/gufo', { project, options: null });
      expect(response.status).toBe(200);
    });
    it('Should return 200 on /v1/modularize', async () => {
      const response = await post('/v1/modularize', { project, options: null });
      expect(response.status).toBe(200);
    });
  });

  describe('Test collective patterns', () => {
    const project = new Project({ id: 'collective patterns' });
    const model = project.createModel();

    const person = model.createKind('Person');
    const team = model.createCollective('Team');
    const association = model.createCollective('Clubs Association');

    team.isExtensional = true;

    model.createSubCollectionOfRelation(team, association);
    model.createMemberOfRelation(person, team);

    it('Should return 200 on /v1/verify', async () => {
      const response = await post('/v1/verify', { project, options: null });
      expect(response.status).toBe(200);
    });
    it('Should return 200 on /v1/transform/gufo', async () => {
      const response = await post('/v1/transform/gufo', { project, options: null });
      expect(response.status).toBe(200);
    });
    it('Should return 200 on /v1/modularize', async () => {
      const response = await post('/v1/modularize', { project, options: null });
      expect(response.status).toBe(200);
    });
  });

  describe('Test quantity patterns', () => {
    const project = new Project({ id: 'quantity patterns' });
    const model = project.createModel();

    const wine = model.createQuantity('Wine');
    const water = model.createQuantity('Water');
    const sugar = model.createQuantity('Sugar');
    const alcohol = model.createQuantity('Alcohol');

    model.createSubQuantityOfRelation(wine, water);
    model.createSubQuantityOfRelation(water, water);
    model.createSubQuantityOfRelation(sugar, water);
    model.createSubQuantityOfRelation(alcohol, water);

    it('Should return 200 on /v1/verify', async () => {
      const response = await post('/v1/verify', { project, options: null });
      expect(response.status).toBe(200);
    });
    it('Should return 200 on /v1/transform/gufo', async () => {
      const response = await post('/v1/transform/gufo', { project, options: null });
      expect(response.status).toBe(200);
    });
    it('Should return 200 on /v1/modularize', async () => {
      const response = await post('/v1/modularize', { project, options: null });
      expect(response.status).toBe(200);
    });
  });

  describe('Test relator patterns', () => {
    const project = new Project({ id: 'relator patterns' });
    const model = project.createModel();

    const person = model.createKind('Person');
    const student = model.createRole('Student');
    const school = model.createKind('School');
    const teachingInstitution = model.createRole('Teaching Institution');
    const enrollment = model.createRelator('Enrollment');

    model.createGeneralization(person, student);
    model.createGeneralization(school, teachingInstitution);

    const studiesAt = model.createMaterialRelation(student, teachingInstitution, 'studies-at');
    model.createMediationRelation(enrollment, student);
    model.createMediationRelation(enrollment, teachingInstitution);
    model.createDerivationRelation(studiesAt, enrollment);

    it('Should return 200 on /v1/verify', async () => {
      const response = await post('/v1/verify', { project, options: null });
      expect(response.status).toBe(200);
    });
    it('Should return 200 on /v1/transform/gufo', async () => {
      const response = await post('/v1/transform/gufo', { project, options: null });
      expect(response.status).toBe(200);
    });
    it('Should return 200 on /v1/modularize', async () => {
      const response = await post('/v1/modularize', { project, options: null });
      expect(response.status).toBe(200);
    });
  });

  describe('Test mode patterns', () => {
    const project = new Project({ id: 'mode patterns' });
    const model = project.createModel();

    const person = model.createKind('Person');
    const researcher = model.createRole('Researcher');
    const topic = model.createKind('Topic');
    const topicInterest = model.createExtrinsicMode('Topic Interest');
    const belief = model.createIntrinsicMode('Belief');

    model.createGeneralization(person, researcher);

    const isInterestedIn = model.createMaterialRelation(researcher, topic, 'is-interested-in');
    model.createCharacterizationRelation(topicInterest, researcher);
    model.createExternalDependencyRelation(topicInterest, topic);
    model.createDerivationRelation(isInterestedIn, topicInterest);

    model.createCharacterizationRelation(belief, researcher);

    it('Should return 200 on /v1/verify', async () => {
      const response = await post('/v1/verify', { project, options: null });
      expect(response.status).toBe(200);
    });
    it('Should return 200 on /v1/transform/gufo', async () => {
      const response = await post('/v1/transform/gufo', { project, options: null });
      expect(response.status).toBe(200);
    });
    it('Should return 200 on /v1/modularize', async () => {
      const response = await post('/v1/modularize', { project, options: null });
      expect(response.status).toBe(200);
    });
  });

  describe('Test quality patterns', () => {
    const project = new Project({ id: 'quality patterns' });
    const model = project.createModel();

    const person = model.createKind('Person');
    const weight = model.createQuality('Weight');
    const kilogram = model.createDatatype('Kilogram');
    const consciousnessState = model.createEnumeration('Consciousness State');

    const heavierThan = model.createComparativeRelation(person, person, 'heavier-than');
    model.createDerivationRelation(heavierThan, weight);
    model.createCharacterizationRelation(weight, person);
    model.createBinaryRelation(kilogram, weight);

    person.createAttribute(consciousnessState, 'consciousnessState');
    consciousnessState.createLiteral('Conscious');
    consciousnessState.createLiteral('Unconscious');

    it('Should return 200 on /v1/verify', async () => {
      const response = await post('/v1/verify', { project, options: null });
      expect(response.status).toBe(200);
    });
    it('Should return 200 on /v1/transform/gufo', async () => {
      const response = await post('/v1/transform/gufo', { project, options: null });
      expect(response.status).toBe(200);
    });
    it('Should return 200 on /v1/modularize', async () => {
      const response = await post('/v1/modularize', { project, options: null });
      expect(response.status).toBe(200);
    });
  });

  describe('Test event patterns', () => {
    const project = new Project({ id: 'event patterns' });
    const model = project.createModel();

    const agent = model.createCategory('Agent');
    const committer = model.createHistoricalRoleMixin('Committer');
    const software = model.createKind('Software');
    const defect = model.createIntrinsicMode('Defect');
    const quarterlyRelease = model.createEvent('Quarterly Release');
    const pullRequest = model.createEvent('Pull Request');
    const bugIntroduction = model.createEvent('Bug Introduction');
    const bugFix = model.createEvent('Bug Fix');
    const softwareFailure = model.createEvent('Software Failure');
    const faultState = model.createSituation('Fault State');

    model.createGeneralization(agent, committer);

    model.createParticipationRelation(committer, pullRequest);
    model.createParticipationRelation(software, pullRequest);

    model.createParticipationalRelation(bugFix, pullRequest);
    model.createParticipationalRelation(bugIntroduction, pullRequest);

    model.createPartWholeRelation(pullRequest, quarterlyRelease);

    model.createCreationRelation(defect, bugIntroduction);
    model.createTerminationRelation(defect, bugFix);
    model.createBringsAboutRelation(bugIntroduction, faultState);
    model.createTriggersRelation(faultState, bugFix);

    model.createCharacterizationRelation(defect, software);
    model.createHistoricalDependenceRelation(defect, committer);
    model.createManifestationRelation(defect, softwareFailure);

    it('Should return 200 on /v1/verify', async () => {
      const response = await post('/v1/verify', { project, options: null });
      expect(response.status).toBe(200);
    });
    it('Should return 200 on /v1/transform/gufo', async () => {
      const response = await post('/v1/transform/gufo', { project, options: null });
      expect(response.status).toBe(200);
    });
    it('Should return 200 on /v1/modularize', async () => {
      const response = await post('/v1/modularize', { project, options: null });
      expect(response.status).toBe(200);
    });
  });
});
