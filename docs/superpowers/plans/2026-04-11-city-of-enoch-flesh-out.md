# City of Enoch Fleshing Out Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the basic Enoch city generation into a detailed, lore-accurate "Titan-Scale" bastion with specialized districts, materials, and architectural scaling.

**Architecture:** Update the Python-based Godot scene generator (`generate_enoch_v3.py` -> `v4`) to include procedurally placed "forbidden technology" assets, multi-scale buildings, and astronomical alignments.

**Tech Stack:** Python (Godot .tscn generation), Godot 4.2 (StandardMaterial3D, CSG nodes).

---

### Task 1: Enhanced Materials and Material Library

**Files:**
- Create: `Nephilim-Wars/generate_enoch_v4.py` (Copy from v3 first)
- Modify: `Nephilim-Wars/generate_enoch_v4.py`

- [ ] **Step 1: Copy v3 to v4 and add new materials**
Update the material definitions to include Obsidian, River-Onyx, and Bronze.

```python
# Add these to the sub_resource section
[sub_resource type="StandardMaterial3D" id="StandardMaterial3D_obsidian"]
albedo_color = Color(0.05, 0.05, 0.08, 1)
metallic = 0.8
roughness = 0.1
clearcoat_enabled = true

[sub_resource type="StandardMaterial3D" id="StandardMaterial3D_onyx_paving"]
albedo_color = Color(0.1, 0.1, 0.1, 1)
roughness = 0.4
uv1_scale = Vector3(0.1, 0.1, 0.1)
uv1_triplanar = true

[sub_resource type="StandardMaterial3D" id="StandardMaterial3D_bronze"]
albedo_color = Color(0.8, 0.5, 0.2, 1)
metallic = 1.0
roughness = 0.4
```

- [ ] **Step 2: Commit**
`git add Nephilim-Wars/generate_enoch_v4.py && git commit -m "feat: init enoch v4 with enhanced material library"`

---

### Task 2: Nephilim-Scale Housing and Elevated Walkways

**Files:**
- Modify: `Nephilim-Wars/generate_enoch_v4.py`

- [ ] **Step 1: Implement `generate_house` function with dual-scale openings**
Replace the simple house loop with a function that adds Nephilim doors and human walkways.

```python
def generate_house(id, x, z, width, height, depth):
    # Base House
    house = f'''
[node name="House_{id}" type="CSGBox3D" parent="Terrain"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, {x}, {height/2}, {z})
size = Vector3({width}, {height}, {depth})
material = SubResource("StandardMaterial3D_sandstone")

[node name="NephilimDoor_{id}" type="CSGBox3D" parent="Terrain/House_{id}"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, -{height/2 - 10}, {depth/2})
operation = 2
size = Vector3(12, 20, 4)

[node name="HumanDoor_{id}" type="CSGBox3D" parent="Terrain/House_{id}"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 4, -{height/2 - 3.5}, {depth/2})
operation = 2
size = Vector3(3, 7, 4)
'''
    return house
```

- [ ] **Step 2: Update the house placement loop**
Modify the loop to use the new function and add elevated "Human Walkways" (10ft up).

- [ ] **Step 3: Commit**
`git add Nephilim-Wars/generate_enoch_v4.py && git commit -m "feat: add nephilim-scale housing and elevated walkways"`

---

### Task 3: The Watcher Grid (Ziggurat Top)

**Files:**
- Modify: `Nephilim-Wars/generate_enoch_v4.py`

- [ ] **Step 1: Add the "Watcher Grid" to the Ziggurat tier 2 (top)**
Create a gold-etched pattern on the floor for astronomical divination.

```python
# After Ziggurat Tier 2 creation
tscn += f'''
[node name="WatcherGrid" type="CSGBox3D" parent="Terrain/ZigguratTier2"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 20.1, 0)
size = Vector3(90, 0.2, 90)
material = SubResource("StandardMaterial3D_gold")
'''
```

- [ ] **Step 2: Add Obsidian Labs/Greenhouses for Semjaza**
Place obsidian structures around the base of the ziggurat.

- [ ] **Step 3: Commit**
`git add Nephilim-Wars/generate_enoch_v4.py && git commit -m "feat: add watcher grid and obsidian labs"`

---

### Task 4: Industrial Forges and Nomadic Pens

**Files:**
- Modify: `Nephilim-Wars/generate_enoch_v4.py`

- [ ] **Step 1: Implement Industrial Forges (Tubal-Cain Sector)**
Add forges near the river with "forbidden heat" (emissive materials).

- [ ] **Step 2: Implement Nomadic Tents and Livestock Pens (Jabal Sector)**
Place simple CSG shapes representing tents and pens on the city outskirts.

- [ ] **Step 3: Commit**
`git add Nephilim-Wars/generate_enoch_v4.py && git commit -m "feat: add industrial forges and nomadic sectors"`

---

### Task 5: Scene Generation and Verification

**Files:**
- Modify: `Nephilim-Wars/generate_enoch_v4.py` (Update output path)

- [ ] **Step 1: Set output path to `game/enoch_city.tscn`**

- [ ] **Step 2: Run the script**
Run: `python Nephilim-Wars/generate_enoch_v4.py`
Expected: `game/enoch_city.tscn` updated.

- [ ] **Step 3: Verification**
Check the file size and presence of new materials (Obsidian, Onyx).

- [ ] **Step 4: Commit**
`git add game/enoch_city.tscn && git commit -m "feat: generate fleshed-out city of enoch scene"`
