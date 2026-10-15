# Deliverable 1: The Removed Interaction & The Problem

**Removed:** The **shutter button** in the mobile camera app.

**Why it existed:** The shutter historically fulfilled five critical jobs: declaring unambiguous capture intent, freezing an exact split-second, confirming capture through feedback, offering a fixed thumb target, and maintaining a familiar mental model. Crucially, the physical act of tapping a screen button induces device tremor — causing camera-shake blur at the precise instant of exposure.

**The core problem:** Without a shutter button, users lack a direct command to trigger capture, risking unintended shots or missed memories. Naive solutions — like volume-key triggers or full-screen tapping — simply relocate the physical button and preserve the shake penalty. 

**The design question:** *How can a camera infer deliberate intent and capture the optimal moment without requiring a destructive command?* The tap only sets the focus point; capture waits until the phone is steady.
