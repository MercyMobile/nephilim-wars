import random
import math

def get_uid():
    return "uid://" + "".join(random.choices("abcdefghijklmnopqrstuvwxyz0123456789", k=13))

uid = 'uid://b2x1p7j5k9q8l'
tscn = f'''[gd_scene format=3 uid="{uid}"]

[sub_resource type="StandardMaterial3D" id="StandardMaterial3D_sandstone"]
albedo_color = Color(0.85, 0.75, 0.6, 1)
roughness = 0.9

[sub_resource type="StandardMaterial3D" id="StandardMaterial3D_onyx"]
albedo_color = Color(0.02, 0.02, 0.02, 1)
metallic = 0.9
roughness = 0.15

[sub_resource type="StandardMaterial3D" id="StandardMaterial3D_gold"]
albedo_color = Color(1, 0.84, 0, 1)
metallic = 1.0
roughness = 0.3
emission_enabled = true
emission = Color(0.4, 0.3, 0, 1)
emission_energy_multiplier = 1.5

[sub_resource type="StandardMaterial3D" id="StandardMaterial3D_river"]
albedo_color = Color(0.1, 0.3, 0.5, 0.8)
metallic = 0.3
roughness = 0.1
transparency = 1

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

[sub_resource type="StandardMaterial3D" id="StandardMaterial3D_forge"]
albedo_color = Color(0.9, 0.3, 0.1, 1)
emission_enabled = true
emission = Color(0.8, 0.2, 0.0, 1)
emission_energy_multiplier = 3.0

[sub_resource type="StandardMaterial3D" id="StandardMaterial3D_grass"]
albedo_color = Color(0.2, 0.35, 0.15, 1)
roughness = 1.0

[sub_resource type="ProceduralSkyMaterial" id="ProceduralSkyMaterial_enoch"]
sky_top_color = Color(0.2, 0.3, 0.5, 1)
sky_horizon_color = Color(0.8, 0.6, 0.4, 1)

[sub_resource type="Sky" id="Sky_enoch"]
sky_material = SubResource("ProceduralSkyMaterial_enoch")

[sub_resource type="Environment" id="Environment_enoch"]
background_mode = 2
sky = SubResource("Sky_enoch")
ambient_light_source = 3
ambient_light_color = Color(0.3, 0.3, 0.3, 1)
tonemap_mode = 2
glow_enabled = true
glow_intensity = 1.5
glow_bloom = 0.2

[node name="EnochCity" type="Node3D"]

[node name="WorldEnvironment" type="WorldEnvironment" parent="."]
environment = SubResource("Environment_enoch")

[node name="SolsticeSunrise" type="DirectionalLight3D" parent="."]
transform = Transform3D(-0.707107, -0.353553, 0.612372, 0, 0.866025, 0.5, -0.707107, 0.353553, -0.612372, 0, 500, 0)
light_color = Color(1, 0.9, 0.75, 1)
light_energy = 2.0
shadow_enabled = true

[node name="Terrain" type="CSGCombiner3D" parent="."]
use_collision = true

[node name="Valley" type="CSGBox3D" parent="Terrain"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, -10, 0)
size = Vector3(3000, 20, 3000)
material = SubResource("StandardMaterial3D_grass")

[node name="Hill" type="CSGCylinder3D" parent="Terrain"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0)
radius = 400.0
height = 100.0
sides = 32
material = SubResource("StandardMaterial3D_grass")

'''

# River winding through the valley
tscn += f'''
[node name="RiverBed" type="CSGSphere3D" parent="Terrain"]
transform = Transform3D(5, 0, 0, 0, 0.5, 0, 0, 0, 50, 600, 0, 0)
operation = 2
radius = 100.0
material = SubResource("StandardMaterial3D_river")

[node name="RiverWater" type="CSGBox3D" parent="Terrain"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 600, -2, 0)
size = Vector3(200, 4, 3000)
material = SubResource("StandardMaterial3D_river")
'''

# Ziggurat on the hill
sizes = [200, 150, 100]
height = 40
start_y = 50
for i, size in enumerate(sizes):
    y_pos = start_y + i * height + height/2
    tscn += f'''
[node name="ZigguratTier{i}" type="CSGBox3D" parent="Terrain"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, {y_pos}, 0)
size = Vector3({size}, {height}, {size})
material = SubResource("StandardMaterial3D_sandstone")
'''

# The Watcher Grid on top tier
tscn += f'''
[node name="WatcherGrid" type="CSGBox3D" parent="Terrain/ZigguratTier2"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 20.1, 0)
size = Vector3(90, 0.2, 90)
material = SubResource("StandardMaterial3D_gold")

[node name="WatcherLab_0" type="CSGBox3D" parent="Terrain"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 120, 25, 120)
size = Vector3(40, 50, 40)
material = SubResource("StandardMaterial3D_obsidian")

[node name="WatcherLab_1" type="CSGBox3D" parent="Terrain"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, -120, 25, -120)
size = Vector3(40, 50, 40)
material = SubResource("StandardMaterial3D_obsidian")
'''

# Megalithic Walls around the city
wall_radius = 800
num_wall_segments = 24
for i in range(num_wall_segments):
    angle = i * (math.pi * 2 / num_wall_segments)
    x = math.cos(angle) * wall_radius
    z = math.sin(angle) * wall_radius
    rot_y = -angle + math.pi/2
    
    tscn += f'''
[node name="WallSegment_{i}" type="CSGBox3D" parent="Terrain"]
transform = Transform3D({math.cos(rot_y)}, 0, {math.sin(rot_y)}, 0, 1, 0, {-math.sin(rot_y)}, 0, {math.cos(rot_y)}, {x}, 20, {z})
size = Vector3(220, 60, 20)
material = SubResource("StandardMaterial3D_sandstone")

[node name="WallTower_{i}" type="CSGCylinder3D" parent="Terrain"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, {x}, 40, {z})
radius = 25.0
height = 100.0
sides = 8
material = SubResource("StandardMaterial3D_sandstone")
'''

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

[node name="HumanWalkway_{id}" type="CSGBox3D" parent="Terrain/House_{id}"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, -{height/2 - 10}, {depth/2 + 5})
size = Vector3({width + 4}, 1, 10)
material = SubResource("StandardMaterial3D_onyx_paving")
'''
    return house

# Sprawling Houses
num_houses = 400
for i in range(num_houses):
    # Cluster houses around the hill, between ziggurat and walls
    angle = random.uniform(0, math.pi * 2)
    dist = random.uniform(250, 750)
    x = math.cos(angle) * dist
    z = math.sin(angle) * dist
    
    # Avoid the river
    if x > 500 and x < 700:
        x += 200
        
    h_w = random.uniform(30, 60) # Larger houses for Nephilim scale
    h_h = random.uniform(40, 100)
    h_d = random.uniform(30, 60)
    
    tscn += generate_house(i, x, z, h_w, h_h, h_d)

# Industrial Sector (Tubal-Cain)
for i in range(12):
    angle = random.uniform(-0.2, 0.2)
    dist = 600 + random.uniform(-100, 100)
    x = 600 + random.uniform(-50, 50)
    z = random.uniform(-1000, 1000)
    
    tscn += f'''
[node name="Forge_{i}" type="CSGBox3D" parent="Terrain"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, {x}, 15, {z})
size = Vector3(40, 30, 40)
material = SubResource("StandardMaterial3D_bronze")

[node name="ForgeHeat_{i}" type="CSGBox3D" parent="Terrain/Forge_{i}"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, -10, 21)
size = Vector3(20, 10, 5)
material = SubResource("StandardMaterial3D_forge")
'''

# Nomadic Sector (Jabal)
for i in range(30):
    angle = random.uniform(0, math.pi * 2)
    dist = random.uniform(900, 1200) # Outside the walls
    x = math.cos(angle) * dist
    z = math.sin(angle) * dist
    
    # Simple Tent
    tscn += f'''
[node name="NomadTent_{i}" type="CSGCylinder3D" parent="Terrain"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, {x}, 10, {z})
radius = 15.0
height = 20.0
sides = 6
material = SubResource("StandardMaterial3D_sandstone")

[node name="LivestockPen_{i}" type="CSGTorus3D" parent="Terrain"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, {x + 30}, 2, {z + 30})
inner_radius = 25.0
outer_radius = 30.0
sides = 8
ring_sides = 4
material = SubResource("StandardMaterial3D_bronze")
'''

# Some taller structures
for i in range(10):
    angle = random.uniform(0, math.pi * 2)
    dist = random.uniform(200, 300)
    x = math.cos(angle) * dist
    z = math.sin(angle) * dist
    
    tscn += f'''
[node name="HighTower_{i}" type="CSGCylinder3D" parent="Terrain"]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, {x}, 100, {z})
radius = 15.0
height = 200.0
sides = 6
material = SubResource("StandardMaterial3D_sandstone")
'''

with open('game/enoch_city.tscn', 'w') as f:
    f.write(tscn)
