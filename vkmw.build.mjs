#!/usr/bin/env node
import es from 'esbuild';
import { readFileSync } from 'fs';

const log = (...ent) => console.log("[vkmusic-wrapper] [builder]", ...ent); 
const calcws = (strings, margin = 1) => {
    const sorted = strings.sort((a,b) => {
        if(a.length < b.length) return 1
        if(a.length > b.length) return -1
        return 0
    })
    const max = sorted[0].length
    return sorted.map(string => ({
        string,
        margin: Array((max - string.length) + margin).fill(" ").join("")
    }))
}  
const isProd = process.env.NODE_ENV === 'production';
const projpackage = JSON.parse(readFileSync("./package.json").toString());

log(`Runned build in ${isProd ? `"production"` : `"developer"`} mode`);

const input = './src/index.ts';
const output = './build/vkmw.build';

const formats = {
    'cjs': {
        ext: 'js',
        name: "CommonJS"
    },
    'esm': {
        ext: 'mjs',
        name: "ESM"
    }
};

Promise.all(
	Object.entries(formats).map( async ([format, { name, ext }]) =>
		({
            name,
            format,
            ext,
            build: await es.build({
                entryPoints: [input],
                bundle: true,
                minify: isProd,
                outfile: `${output}.${ext}`,
                format,
                loader: {
                    '.ts': 'ts',
                    '.json': 'json',
                },
                tsconfig: "./tsconfig.json",
                platform: "node",
                external: [
                    ...Object.keys(projpackage.dependencies || {}),
                    ...Object.keys(projpackage.peerDependencies || {}),
                ]
            })
        })
	)
)
	.then((results) => {
        console.log();
        log("All files builded!");
        console.log();
        log("Bundles");
        const ws = calcws(results.map(e => e.name), 4)
        results.map(bundle => {
            const freespace = ws.find(e => e.string === bundle.name).margin
            log(`  ${bundle.name}${freespace}${output}.${bundle.ext}`);
        })
    })