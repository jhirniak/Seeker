#!/usr/bin/python

import sys, json, re

def txt2json(fn):
    txt = open(fn) # Add buffering? r, 1
    js = {}
    js['filename'] = fn
    js['chapters'] = {}
    js['sections'] = {}
    js['paragraphs'] = {}

    # Get info from file, if proper file should include: country, source (producing committee), cycle, report-language
    info = info_from_filename(fn)
    if info:
        for k in info.keys():
            js[k] = info[k]

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

# Country
re_spec = r'^UK'
re_country_candidate = r'^[A-Z][a-z]+'
cre_spec = re.compile(re_spec)
cre_country_candidate = re.compile(re_country_candidate)
countries_lst = ['Armenia', 'Austria', 'Bosnia and Herzegovina', 'Croatia', 'Cyprus', 'Czech', 'Denmark', 'Finland', 'Germany', 'Hungary', 'Liechtenstein', 'Luxembourg', 'Montenegro', 'Netherlands', 'Norway', 'Poland', 'Romania', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'UK']
countries_map = {
    'Czech': 'Czech Republic',
    'UK': 'United Kingdom'
}

# Committee
re_committee = r'^(CMRec|ECRML|PR)'
cre_committee = re.compile(re_committee)
committee_map = {
    'CMRec': 'Committee of Ministers',
    'ECRML': 'Committee of Experts',
    'PR': 'Periodical Report'
}

# Cycle
re_cycle = r'\d+'
cre_cycle = re.compile(re_cycle)

# Language
re_language = r'(?<=_)[a-z]+'
cre_language = re.compile(re_language)

def info_from_filename(fn):
    country = None
    committee = None
    cycle = None
    language = None

    # Country
    if cre_spec.search(fn):
        # one of special (currently only UK)
        country = countries_map['UK']
        fn = fn[2:]
    else:
        # normal country name (big letter small letters)
        cc = cre_country_candidate.search(fn)
        if cc and cc.group() in countries_lst:
            cc = cc.group()
            fn = fn[fn.index(cc) + len(cc):] # move pointer
            if cc in countries_map.keys():
                country = countries_map[cc]
            else:
                country = cc

    # Committee
    com = cre_committee.search(fn)
    if com:
        com = com.group()
        committee = committee_map[com]
        fn = fn[fn.index(com) + len(com):]

    # Cycle
    cyc = cre_cycle.search(fn)
    if cyc:
        cyc = cyc.group()
        cycle = int(cyc)
        fn = fn[fn.index(cyc) + len(cyc):]

    # Language
    lang = cre_language.search(fn)
    if lang:
        lang = lang.group()
        language = lang

    if not country or not committee or not cycle or not language:
        return None
    else:
        return {'country': country, 'source': committee, 'cycle': cycle, 'report-language': language}

# Parse from filename
re_country = r'' # one of
re_reporttype = r'' #
re_cycle = r''
re_reportlang = r''

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
