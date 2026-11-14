'use strict'

const PREFIX = 'studyCompanion:'

const save = function(key, value){
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
}

const load = function(key, fallback) { 
   const stored = localStorage.getItem(PREFIX + key)

    // Nothing in the locker: hand back the fallback
   if(stored === null) return fallback
    
    try{
         // Text in, real value out
        return JSON.parse(stored)
    } catch (err) {
         // if the  text was broken: hand back the fallback instead of crashing
       return fallback
    }
}