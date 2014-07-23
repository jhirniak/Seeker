#!/usr/bin/python

import sys, json, re

def txt2json(fn):
    txt = open(fn) # Add buffering? r, 1
    js = {}
    js['filename'] = fn
    js['chapters'] = {}
    js['sections'] = {}
    js['paragraphs'] = {}

    with open(fn, 'r') as f:
        txt = f.read()
        for ch in create_map(txt, re_chapter):
            isec = []
            for sec in create_map(ch.value, re_section):
                ipar = []
                for par in create_map(sec.value, re_paragraph):
                    js['paragraphs'][par.key] = par.value # must be unique
                    ipar.append(par.key)
                arr_add(js['sections'], sec.key, ipar)
                isec.append(sec.key)
            arr_add(js['chapters'], ch.key, isec)

    for s in ['chapters', 'sections']:
        for k in js[s]:
            js[s][k] = list(set(js[s][k])) # remove duplicates
            js[s][k].sort(cmp=ref_cmp)
        

    return json.dumps(js)

def ref_cmp(a, b):
    if len(a) < len(b):
        return -1
    elif len(b) > len(a):
        return 1
    else:
        return cmp(a, b)

re_chapter = r'Chapter \d+'
re_section = r'(\d\.){2,}'
re_paragraph = r'^\d+\.'
re_config = re.DOTALL + re.MULTILINE

def get_boundaries(stack, needle):
    sections = [m.start(0) for m in re.finditer(needle, stack, re_config)]
    sections.append(len(stack))
    boundaries = []

    for i in range(len(sections) - 1):
        boundaries.append((sections[i], sections[i + 1]))

    return boundaries
    
def create_map(stack, needle):
    re_key = re.compile(needle, re_config)
    boundaries = get_boundaries(stack, needle)
    keys = []
    values = []
    for b in boundaries:
        p = stack[b[0]:b[1]]
        k = re_key.search(p).group()
        c = p[len(k):]
        keys.append(k)
        values.append(c)
    return MapIter(keys, values) # rewrite to return MapIter(keys, values)

def arr_add(arr, key, val):
    if key in arr:
        arr[key].extend(val)
    else:
        arr[key] = val

class MapItem:
    def __init__(self, key, value):
        self.key = key
        self.value = value

class MapIter:
    def __init__(self, keys, values):
        self.keys = keys
        self.values = values
        self.length = len(keys)
        self.current = 0

    def __iter__(self):
        return self

    def next(self):
        if self.current >= self.length:
            raise StopIteration
        else:
            m = MapItem(self.keys[self.current], self.values[self.current])
            self.current += 1
            return m

if __name__ == "__main__":
    if (len(sys.argv) == 2):
        print txt2json(sys.argv[1])
    else:
        print "Expected 1 argument - filename/path of text file to be converged to JSON, but found none."
        raise
