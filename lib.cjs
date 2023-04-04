#!/usr/bin/env node
const fs = require( 'node:fs' )
const path = require( 'node:path' )
const { execSync } = require( 'node:child_process' );
const fse = require( 'fs-extra' );
const lnk = require( 'lnk' );
const JSON5 = require( 'json5' );

const DS = path.sep
const CMD = {
    VSCODE_WORKSPACE: 'vscode-workspace',
    SETUP_LINK: 'setup-link',
    EXERCISE_LINK: 'exercise-link',
    ADD_EXERCISE: 'addex',
    DOUBLE_DASH: '--',
}

const TRACK = 'purescript'
const EXERCISES_DIR = 'exercises'
const AUX_DIRS = ['.spago', 'output']
const VSCODE_WORKSPACE_DEFAULT_FILE =
    '.vscode/exercism-purescript.code-workspace'

const cmd = process.argv[2]
const arg1 = process.argv[3]

if ( cmd === CMD.VSCODE_WORKSPACE )
{
    const workspacePath = arg1 || path.resolve( VSCODE_WORKSPACE_DEFAULT_FILE )
    const workspace = fs.existsSync( workspacePath )
        ? JSON5.parse( fs.readFileSync( workspacePath ).toString() )
        : {
            folders: fs.readdirSync( EXERCISES_DIR, { withFileTypes: true } )
                .filter( d => d.isDirectory() )
                .map( ( { name } ) => ( { path: `../${EXERCISES_DIR}/${name}` } ) )
        }
    workspace.settings = workspace.settings || {}
    workspace.settings['purescript.pursExe'] =
        path.resolve( 'node_modules', '.bin', 'purs' ).replace( /\\/g, '/' )
    fse.outputFileSync( workspacePath, JSON.stringify( workspace, null, 2 ) )
}

else if ( cmd === CMD.SETUP_LINK )
{
    const workspaceDir = ( function ()
    {
        let wsDir
        try { wsDir = execSync( 'exercism workspace' ).toString().trim() }
        catch { process.exit( 1 ) }
        return wsDir
    }() )
    const target = path.resolve( '.' )
    const source = path.resolve( workspaceDir, TRACK )

    fse.existsSync( source ) || fse.mkdirSync( source )

    console.log( `Linking exercism ${TRACK} track folder` )
    lnk( [source], target, { force: true, rename: EXERCISES_DIR } )
        .then( () => console.log(
            `.${DS}${EXERCISES_DIR} -> ${source} `
        ) )
        .catch( e => console.error( e.message ) )
}

else if ( cmd === CMD.EXERCISE_LINK )
{
    const exercise = path.join( EXERCISES_DIR, arg1 )
    console.log( `Linking ${AUX_DIRS}` )
    if ( fs.existsSync( exercise ) )
        lnk( AUX_DIRS, exercise, { force: true } )
            .then( () => console.log(
                `.${DS}${exercise}${DS}{${AUX_DIRS}} -> .${DS}{${AUX_DIRS}}`
            ) )
            .catch( e => console.error( e.message ) )
    else
        console.error( `${exercise} not found` )
}

else if ( cmd === CMD.ADD_EXERCISE )
{
    const force = process.env.npm_config_force ? ' -- --force' : ''
    const exercise = arg1
    try
    {
        execSync(
            `npm run ex-download ${exercise}${force}`,
            { stdio: 'inherit' }
        )
        execSync( `npm run ex-link ${exercise}`, { stdio: 'inherit' } )
    }
    catch ( e )
    {
        console.error( e.message )
    }
}

else if ( cmd === CMD.DOUBLE_DASH )
{
    const command = process.argv.slice(
        Math.max( 3, process.argv.indexOf( '--' ) + 1 )
    ).join( ' ' )
    process.chdir( process.env.INIT_CWD || '.' )
    execSync( `npx ${command}`, { stdio: 'inherit' } )
}

else
{
    console.error( `Unknown command ${cmd}` )
}
