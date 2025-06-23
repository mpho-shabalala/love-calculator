import { describe, it, vi, expect } from "vitest";
import Calculator from "../Calculator";


describe('Calculator class logic methods', () => {
    const calc = new Calculator('x','x', 'x', 'x', 'x', 'x');

    it('combineNamesWithNameJoiner join names correctly', () => {
        expect(calc.combineNamesWithNameJoiner('bob', 'alice', 'loves')).toBe('boblovesalice')
    })

    it('throws an error when the either name is an empty string', () => {
        expect(() => {
        calc.combineNamesWithNameJoiner('', '', 'loves');
        }).toThrow('Please enter valid names');
    });

    it('throws an error when a non-alphabet character is used in either player name except for space, apostrophe, and hyphen', () => {
        expect(() => {
            combineNamesWithNameJoiner('bob2', 'alice', 'loves').toThrow('Names can only contain letters');
        })
    })

     it('throws an error when a non-alphabet character is used in either player name except for space, apostrophe, and hyphen', () => {
        expect(() => {
            combineNamesWithNameJoiner('bob!', 'alice', 'loves').toThrow('Names can only contain letters');
        })

    
})

   it('throws an error when a non-alphabet character is used in either player name except for space, apostrophe, and hyphen', () => {

        expect(() => {
            calc.combineNamesWithNameJoiner(null, 'alice', 'loves');
        }).toThrow('Please enter valid names');
    })

  it('counts each character from the combined names and joiner', () => {
  expect(calc.countEachCharacterFromJoinedString('Johnlovesjane')).toEqual([
    { character: 'j', count: 2 },
    { character: 'o', count: 2 },
    { character: 'h', count: 1 },
    { character: 'n', count: 2 },
    { character: 'l', count: 1 },
    { character: 'v', count: 1 },
    { character: 'e', count: 2 },
    { character: 's', count: 1 },
    { character: 'a', count: 1 }
  ]);
});


})

