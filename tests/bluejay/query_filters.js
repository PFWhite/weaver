const qf = require('../../src/bluejay/query_filters.js')
const tu = require('../util.js')
describe('sql query filters', () => {
    describe('esc', () => {
        it('should escape strings', async () => {
            expect(qf.esc("test'mc cool")).toEqual("'test''mc cool'")
        })
        it('should escape numbers', async () => {
            expect(qf.esc(10)).toEqual(10)
            expect(qf.esc(10.123)).toEqual(10.123)
        })
        it('should map over arrays and escape', async () => {
            expect(qf.esc([1,2])).toEqual("(1,2)")
            expect(qf.esc(['a','b'])).toEqual("('a','b')")
        })
        it('should escape undefined values', async () => {
            expect(qf.esc({}.nothing)).toEqual('DEFAULT')
        })
        it('should call functions', async () => {
            expect(qf.esc(() => 'test')).toEqual('test')
        })
        it('should work with NULL', async () => {
            expect(qf.esc('NULL')).toEqual('NULL')
        })
        it('should error otherwise', async () => {
            var error = undefined
            try {
                qf.esc({})
            } catch (err) {
                error = err
            }
            expect(error).not.toBeUndefined()
        })
    })
    describe('dq', () => {
        it('should double quote what is passed', async () => {
            expect(qf.dq('cols')).toEqual('"cols"')
        })
        it('should double quote array things', async () => {
            expect(qf.dq(['a', 'b'])).toEqual(['"a"', '"b"'])
            expect(qf.dq([1, 2])).toEqual(['"1"', '"2"'])
        })
    })
    describe('json', () => {
        it('should stringify whats passed', async () => {
            expect(qf.json({})).toEqual('{}')
            expect(qf.json({a:1})).toEqual('{"a":1}')
        })
    })
    describe('jsonb', () => {
        it('should turn things into jsonb', async () => {
            expect(qf.jsonb({})).toEqual('\'{}\'::jsonb')
            expect(qf.jsonb({a:1})).toEqual(`'{"a":1}'::jsonb`)
        })
    })

    describe('access', () => {
        it('should return an items property from an array of items', async () => {
            expect(qf.access([{a:1}], 'a')).toEqual([1])
        })
        it('should error if passed a non array', async () => {
            try {
                qf.access({a:1}, 'a')
                expect('failure').toEqual('success')
            } catch (err) {
                expect(err).toBeDefined()
            }
        })
    })
    describe('orderedVals', () => {
        it('should return a list of props of an object by keys', async () => {
            var obj = {a: 1, b: 2},
                keys = ['b', 'a']
            expect(qf.orderedVals(obj, keys)).toEqual([2,1])
        })
    })
    describe('wrap', () => {
        it('should wrap the first param', async () => {
            expect(qf.wrap(1)).toEqual('(1)')
            expect(qf.wrap(1, 'j')).toEqual('j1)')
            expect(qf.wrap(1, 'j', 'k')).toEqual('j1k')
        })
    })
    describe('values', () => {
        it('should call orderedVals and escape', async () => {
            var obj = {a: 1, b: "'2"},
                keys = ['b', 'a']
            expect(qf.values(obj, keys)).toEqual(`('''2',1)`)
        })
    })
    describe('columns', () => {
        it('should map over the passed val and double quote', async () => {
            expect(qf.columns([1, 2, 3])).toEqual('"1", "2", "3"')
        })

    })


})
