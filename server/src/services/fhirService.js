const { randomUUID } = require('crypto');

/**
 * Creates a FHIR R4 Bundle for a consultation.
 * @param {object} data - The consultation data.
 * @param {object} data.patientData - Patient information.
 * @param {object} data.doctorData - Doctor information.
 * @param {Array<object>} data.diagnoses - List of diagnoses.
 * @param {Array<object>} data.medications - List of medications.
 * @returns {object} A FHIR R4 Bundle resource.
 */
const createFhirBundle = ({ patientData, doctorData, diagnoses, medications }) => {
    const bundleId = randomUUID();
    const patientResourceId = `Patient/${patientData.id}`;
    const practitionerResourceId = `Practitioner/${doctorData.id}`;
    const encounterResourceId = `Encounter/${randomUUID()}`;
    const compositionResourceId = `Composition/${randomUUID()}`;
    
    const now = new Date().toISOString();

    const resources = [];

    // 1. Patient Resource
    const patientResource = {
        resourceType: 'Patient',
        id: patientData.id,
        identifier: [{
            system: 'https://healthid.ndhm.gov.in',
            value: patientData.abhaNumber
        }],
        name: [{
            text: patientData.name
        }],
        gender: patientData.demographics?.gender?.toLowerCase() || 'unknown',
    };
    resources.push({ fullUrl: `urn:uuid:${patientData.id}`, resource: patientResource });

    // 2. Practitioner Resource
    const practitionerResource = {
        resourceType: 'Practitioner',
        id: doctorData.id,
        identifier: [{
            system: 'https://hpr.abdm.gov.in',
            value: doctorData.hprId
        }],
        name: [{
            text: doctorData.name
        }],
    };
    resources.push({ fullUrl: `urn:uuid:${doctorData.id}`, resource: practitionerResource });

    // 3. Encounter Resource
    const encounterResource = {
        resourceType: 'Encounter',
        id: encounterResourceId.split('/')[1],
        status: 'finished',
        class: {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
            code: 'AMB',
            display: 'ambulatory'
        },
        subject: { reference: `urn:uuid:${patientData.id}` },
        participant: [{
            individual: { reference: `urn:uuid:${doctorData.id}` }
        }],
        period: {
            start: now
        }
    };
    resources.push({ fullUrl: `urn:uuid:${encounterResource.split('/')[1]}`, resource: encounterResource });
    
    const sectionEntries = [];

    // 4. Condition (Diagnoses) Resources
    diagnoses.forEach((diag, index) => {
        const conditionId = `Condition/${randomUUID()}`;
        const conditionResource = {
            resourceType: 'Condition',
            id: conditionId.split('/')[1],
            clinicalStatus: {
                coding: [{
                    system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
                    code: 'active'
                }]
            },
            verificationStatus: {
                coding: [{
                    system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
                    code: 'confirmed'
                }]
            },
            code: {
                coding: diag.codes.map(c => ({
                    system: c.system,
                    code: c.code,
                    display: c.display
                })),
                text: diag.name
            },
            subject: { reference: `urn:uuid:${patientData.id}` },
            encounter: { reference: `urn:uuid:${encounterResource.split('/')[1]}` }
        };
        resources.push({ fullUrl: `urn:uuid:${conditionId.split('/')[1]}`, resource: conditionResource });
        sectionEntries.push({ reference: `urn:uuid:${conditionId.split('/')[1]}` });
    });

    // 5. MedicationRequest Resources
    medications.forEach((med, index) => {
        const medRequestId = `MedicationRequest/${randomUUID()}`;
        const medRequestResource = {
            resourceType: 'MedicationRequest',
            id: medRequestId.split('/')[1],
            status: 'active',
            intent: 'order',
            medicationCodeableConcept: {
                text: med.name
            },
            subject: { reference: `urn:uuid:${patientData.id}` },
            encounter: { reference: `urn:uuid:${encounterResource.split('/')[1]}` },
            authoredOn: now,
            requester: { reference: `urn:uuid:${doctorData.id}` },
            dosageInstruction: [{
                text: `${med.dosage}, ${med.frequency} for ${med.duration}`
            }]
        };
        resources.push({ fullUrl: `urn:uuid:${medRequestId.split('/')[1]}`, resource: medRequestResource });
        sectionEntries.push({ reference: `urn:uuid:${medRequestId.split('/')[1]}` });
    });

    // 6. Composition Resource (to tie it all together)
    const compositionResource = {
        resourceType: 'Composition',
        id: compositionResourceId.split('/')[1],
        status: 'final',
        type: {
            coding: [{
                system: 'http://loinc.org',
                code: '11502-2',
                display: 'Consultation note'
            }]
        },
        date: now,
        author: [{ reference: `urn:uuid:${doctorData.id}` }],
        title: 'Consultation Record',
        subject: { reference: `urn:uuid:${patientData.id}` },
        encounter: { reference: `urn:uuid:${encounterResource.split('/')[1]}` },
        section: [{
            title: 'Clinical Findings and Plan',
            entry: sectionEntries
        }]
    };
    resources.push({ fullUrl: `urn:uuid:${compositionResourceId.split('/')[1]}`, resource: compositionResource });


    const bundle = {
        resourceType: 'Bundle',
        id: bundleId,
        type: 'document',
        timestamp: now,
        entry: resources,
    };

    return bundle;
};


module.exports = {
    createFhirBundle,
};