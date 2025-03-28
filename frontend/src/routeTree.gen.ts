/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as PatientsIdAppointmentsIndexImport } from './routes/patients/$id/appointments/index'
import { Route as PatientsIdAppointmentsCreateImport } from './routes/patients/$id/appointments/create'
import { Route as PatientsIdAppointmentsAppointmentIdIndexImport } from './routes/patients/$id/appointments/$appointmentId/index'
import { Route as PatientsIdAppointmentsAppointmentIdEditIndexImport } from './routes/patients/$id/appointments/$appointmentId/edit/index'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const PatientsIdAppointmentsIndexRoute =
  PatientsIdAppointmentsIndexImport.update({
    id: '/patients/$id/appointments/',
    path: '/patients/$id/appointments/',
    getParentRoute: () => rootRoute,
  } as any)

const PatientsIdAppointmentsCreateRoute =
  PatientsIdAppointmentsCreateImport.update({
    id: '/patients/$id/appointments/create',
    path: '/patients/$id/appointments/create',
    getParentRoute: () => rootRoute,
  } as any)

const PatientsIdAppointmentsAppointmentIdIndexRoute =
  PatientsIdAppointmentsAppointmentIdIndexImport.update({
    id: '/patients/$id/appointments/$appointmentId/',
    path: '/patients/$id/appointments/$appointmentId/',
    getParentRoute: () => rootRoute,
  } as any)

const PatientsIdAppointmentsAppointmentIdEditIndexRoute =
  PatientsIdAppointmentsAppointmentIdEditIndexImport.update({
    id: '/patients/$id/appointments/$appointmentId/edit/',
    path: '/patients/$id/appointments/$appointmentId/edit/',
    getParentRoute: () => rootRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/patients/$id/appointments/create': {
      id: '/patients/$id/appointments/create'
      path: '/patients/$id/appointments/create'
      fullPath: '/patients/$id/appointments/create'
      preLoaderRoute: typeof PatientsIdAppointmentsCreateImport
      parentRoute: typeof rootRoute
    }
    '/patients/$id/appointments/': {
      id: '/patients/$id/appointments/'
      path: '/patients/$id/appointments'
      fullPath: '/patients/$id/appointments'
      preLoaderRoute: typeof PatientsIdAppointmentsIndexImport
      parentRoute: typeof rootRoute
    }
    '/patients/$id/appointments/$appointmentId/': {
      id: '/patients/$id/appointments/$appointmentId/'
      path: '/patients/$id/appointments/$appointmentId'
      fullPath: '/patients/$id/appointments/$appointmentId'
      preLoaderRoute: typeof PatientsIdAppointmentsAppointmentIdIndexImport
      parentRoute: typeof rootRoute
    }
    '/patients/$id/appointments/$appointmentId/edit/': {
      id: '/patients/$id/appointments/$appointmentId/edit/'
      path: '/patients/$id/appointments/$appointmentId/edit'
      fullPath: '/patients/$id/appointments/$appointmentId/edit'
      preLoaderRoute: typeof PatientsIdAppointmentsAppointmentIdEditIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/patients/$id/appointments/create': typeof PatientsIdAppointmentsCreateRoute
  '/patients/$id/appointments': typeof PatientsIdAppointmentsIndexRoute
  '/patients/$id/appointments/$appointmentId': typeof PatientsIdAppointmentsAppointmentIdIndexRoute
  '/patients/$id/appointments/$appointmentId/edit': typeof PatientsIdAppointmentsAppointmentIdEditIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/patients/$id/appointments/create': typeof PatientsIdAppointmentsCreateRoute
  '/patients/$id/appointments': typeof PatientsIdAppointmentsIndexRoute
  '/patients/$id/appointments/$appointmentId': typeof PatientsIdAppointmentsAppointmentIdIndexRoute
  '/patients/$id/appointments/$appointmentId/edit': typeof PatientsIdAppointmentsAppointmentIdEditIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/patients/$id/appointments/create': typeof PatientsIdAppointmentsCreateRoute
  '/patients/$id/appointments/': typeof PatientsIdAppointmentsIndexRoute
  '/patients/$id/appointments/$appointmentId/': typeof PatientsIdAppointmentsAppointmentIdIndexRoute
  '/patients/$id/appointments/$appointmentId/edit/': typeof PatientsIdAppointmentsAppointmentIdEditIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/patients/$id/appointments/create'
    | '/patients/$id/appointments'
    | '/patients/$id/appointments/$appointmentId'
    | '/patients/$id/appointments/$appointmentId/edit'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/patients/$id/appointments/create'
    | '/patients/$id/appointments'
    | '/patients/$id/appointments/$appointmentId'
    | '/patients/$id/appointments/$appointmentId/edit'
  id:
    | '__root__'
    | '/'
    | '/patients/$id/appointments/create'
    | '/patients/$id/appointments/'
    | '/patients/$id/appointments/$appointmentId/'
    | '/patients/$id/appointments/$appointmentId/edit/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  PatientsIdAppointmentsCreateRoute: typeof PatientsIdAppointmentsCreateRoute
  PatientsIdAppointmentsIndexRoute: typeof PatientsIdAppointmentsIndexRoute
  PatientsIdAppointmentsAppointmentIdIndexRoute: typeof PatientsIdAppointmentsAppointmentIdIndexRoute
  PatientsIdAppointmentsAppointmentIdEditIndexRoute: typeof PatientsIdAppointmentsAppointmentIdEditIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  PatientsIdAppointmentsCreateRoute: PatientsIdAppointmentsCreateRoute,
  PatientsIdAppointmentsIndexRoute: PatientsIdAppointmentsIndexRoute,
  PatientsIdAppointmentsAppointmentIdIndexRoute:
    PatientsIdAppointmentsAppointmentIdIndexRoute,
  PatientsIdAppointmentsAppointmentIdEditIndexRoute:
    PatientsIdAppointmentsAppointmentIdEditIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/patients/$id/appointments/create",
        "/patients/$id/appointments/",
        "/patients/$id/appointments/$appointmentId/",
        "/patients/$id/appointments/$appointmentId/edit/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/patients/$id/appointments/create": {
      "filePath": "patients/$id/appointments/create.tsx"
    },
    "/patients/$id/appointments/": {
      "filePath": "patients/$id/appointments/index.tsx"
    },
    "/patients/$id/appointments/$appointmentId/": {
      "filePath": "patients/$id/appointments/$appointmentId/index.tsx"
    },
    "/patients/$id/appointments/$appointmentId/edit/": {
      "filePath": "patients/$id/appointments/$appointmentId/edit/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
