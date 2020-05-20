const clientPath = require.resolve('@scoreman/client');
const overlays = require('@scoreman/overlays');

const path = require('path');
const express = require('express');
const fs = require('fs');
const serveIndex = require('serve-index');

const EXT_OVERLAY_PATHNAME = 'overlays';

const basePath = path.dirname(require.main.filename);
const staticPath = path.dirname(clientPath);

const npmOverlayPaths = require.resolve.paths('').reduce((acc, npmDir) => {
    try {
        const overlayPkgs = fs.readdirSync(npmDir).filter((npmDirPkgs) => {
            return npmDirPkgs.startsWith('scoreman-overlay');
        })
            .map((overlayPkg) => {
                return path.resolve(npmDir, overlayPkg);
            });

        overlayPkgs.forEach((overlayPath) => {
            acc.push(overlayPath);
        });
    } catch (e) {

    }

    return acc;
}, []);

const overlayPaths = [
    overlays.root,
    path.resolve(basePath, EXT_OVERLAY_PATHNAME),
    ...npmOverlayPaths
]

function overlayManifest(req, res) {

}

module.exports = function (app) {
    app.use('/api/config', express.static(
        path.resolve(basePath, 'data', 'config')
    ));
    app.use('/api/characters', express.static(
        path.resolve(basePath, 'data', 'characters')
    ));

    app.use('/', express.static(staticPath));

    app.use('/overlays/manifest.json', overlayManifest);

    overlayPaths.forEach((overlayDir) => {
        app.use('/overlays', serveIndex(overlayDir));
        app.use('/overlays', express.static(overlayDir));
    });

};
