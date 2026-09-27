import { test, describe } from 'node:test';
import * as assert from 'node:assert';

import { EMPTY_PRE_APPOINTMENT, preAppointmentFields } from './pre-appointment';

describe('doctor pre-appointment details', () => {
  test('an untouched form adds no message lines', () => {
    assert.deepStrictEqual(preAppointmentFields(EMPTY_PRE_APPOINTMENT), []);
  });

  test('filled form follows the PART-07 §6 line order and joins age · gender', () => {
    const lines = preAppointmentFields({
      age: '34',
      gender: 'Male',
      symptom: ' Sensitivity in lower left molar ',
      duration: '2 weeks',
      conditions: 'None',
      medication: 'None',
    });
    assert.deepStrictEqual(lines, [
      ['Age', '34 · Male'],
      ['Symptom', 'Sensitivity in lower left molar'],
      ['Duration', '2 weeks'],
      ['Existing Conditions', 'None'],
      ['Current Medication', 'None'],
    ]);
  });

  test('an impossible age is dropped but the gender is kept', () => {
    const lines = preAppointmentFields({ ...EMPTY_PRE_APPOINTMENT, age: '340', gender: 'Female' });
    assert.deepStrictEqual(lines, [['Age', 'Female']]);
  });
});
