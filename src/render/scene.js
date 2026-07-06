import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { cableRoutePoints, stageBoxPos } from '../data/metrics.js';

export const toScene = (x, y, z) => new THREE.Vector3(x, z, -y);

export function createPlannerScene({ viewport, tooltip, onMicSelect, onGoboSelect }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe8e9eb);
  scene.fog = new THREE.Fog(0xe8e9eb, 70, 160);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500);
  camera.position.set(16, 14, 22);

  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  viewport.prepend(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2.5, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI * 0.52;

  scene.add(new THREE.AmbientLight(0xffffff, 0.85));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(14, 26, 12);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdfe6f0, 0.5);
  fill.position.set(-12, 12, -16);
  scene.add(fill);

  const roomGroup = new THREE.Group();
  const kitGroup = new THREE.Group();
  const micsGroup = new THREE.Group();
  const goboGroup = new THREE.Group();
  const cableGroup = new THREE.Group();
  scene.add(roomGroup, kitGroup, micsGroup, goboGroup, cableGroup);

  const MAT = {
    floor: new THREE.MeshStandardMaterial({ color: 0xdcdddf, roughness: 1 }),
    shell: new THREE.MeshStandardMaterial({ color: 0x2f343b, roughness: 0.7, metalness: 0.1 }),
    head: new THREE.MeshStandardMaterial({ color: 0xf2efe7, roughness: 0.55 }),
    cymbal: new THREE.MeshStandardMaterial({
      color: 0xc9a24b,
      roughness: 0.32,
      metalness: 0.8,
      side: THREE.DoubleSide,
    }),
    pole: new THREE.MeshStandardMaterial({ color: 0x6b7078, roughness: 0.45, metalness: 0.6 }),
    micBody: new THREE.MeshStandardMaterial({ color: 0x24272c, roughness: 0.45, metalness: 0.4 }),
    micSel: new THREE.MeshStandardMaterial({
      color: 0xb25c00,
      roughness: 0.4,
      metalness: 0.3,
      emissive: 0x2e1800,
    }),
    grille: new THREE.MeshStandardMaterial({ color: 0x8b9097, roughness: 0.6, metalness: 0.7 }),
    grilleSel: new THREE.MeshStandardMaterial({ color: 0xd08a33, roughness: 0.5, metalness: 0.5 }),
    cable: new THREE.MeshStandardMaterial({ color: 0x2a2c30, roughness: 0.9 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x9c7b52, roughness: 0.85 }),
    fabric: new THREE.MeshStandardMaterial({ color: 0x7d8289, roughness: 1 }),
    box: new THREE.MeshStandardMaterial({ color: 0x33363b, roughness: 0.7 }),
    measure: new THREE.LineDashedMaterial({ color: 0xb25c00, dashSize: 0.25, gapSize: 0.18 }),
  };

  let state = null;
  let selectedMicIndex = 0;
  let selectedGoboIndex = 0;
  let pickables = [];
  let downPos = null;

  function disposeGroup(group) {
    group.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material && obj.userData.ownMaterial) {
        (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((material) => material.dispose());
      }
    });
    group.clear();
  }

  function pick(mesh, label, metadata = {}) {
    mesh.userData.label = label;
    Object.assign(mesh.userData, metadata);
    pickables.push(mesh);
    return mesh;
  }

  function findDrumByName(name) {
    return state?.kit.find((drum) => drum.name === name) || null;
  }

  function micDirection(mic) {
    const from = toScene(mic.x, mic.y, mic.z);
    const drum = findDrumByName(mic.target);
    const to = drum ? toScene(drum.x, drum.y, drum.z) : toScene(0, 0.5, 1.5);
    const dir = to.sub(from);
    return dir.lengthSq() < 1e-6 ? new THREE.Vector3(0, -1, 0) : dir.normalize();
  }

  function addPole(group, x, y, topZ) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, topZ, 8), MAT.pole);
    pole.position.copy(toScene(x, y, topZ / 2));
    group.add(pole);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.05, 16), MAT.pole);
    base.position.copy(toScene(x, y, 0.03));
    group.add(base);
  }

  function addSceneRod(group, start, end, radius = 0.025) {
    const delta = end.clone().sub(start);
    const length = delta.length();
    if (length < 0.01) return;
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 8), MAT.pole);
    rod.position.copy(start).add(end).multiplyScalar(0.5);
    rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
    group.add(rod);
  }

  function addRod(group, start, end, radius = 0.025) {
    addSceneRod(group, toScene(start.x, start.y, start.z), toScene(end.x, end.y, end.z), radius);
  }

  function addRoundFoot(group, x, y, radius = 0.11) {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.08, 0.035, 12), MAT.pole);
    foot.position.copy(toScene(x, y, 0.025));
    group.add(foot);
  }

  function addTripodStand(group, x, y, topZ, radius = 0.52) {
    addPole(group, x, y, topZ);
    const hub = { x, y, z: 0.22 };
    for (const angle of [Math.PI / 2, Math.PI * 1.18, Math.PI * 1.82]) {
      const foot = {
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        z: 0.03,
      };
      addRod(group, hub, foot, 0.022);
      addRoundFoot(group, foot.x, foot.y, 0.09);
    }
  }

  function addKickHardware(group, drum) {
    const radius = drum.diameter / 2;
    const frontY = drum.y - drum.height / 2;
    const backY = drum.y + drum.height / 2;
    for (const side of [-1, 1]) {
      addRod(
        group,
        { x: drum.x + side * radius * 0.78, y: frontY + 0.08, z: radius * 0.48 },
        { x: drum.x + side * radius * 1.05, y: frontY - 0.42, z: 0.035 },
        0.026,
      );
      addRoundFoot(group, drum.x + side * radius * 1.05, frontY - 0.42, 0.12);
    }

    const pedal = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.045, 0.72), MAT.pole);
    pedal.position.copy(toScene(drum.x, backY + 0.32, 0.055));
    group.add(pedal);
    const beater = new THREE.Mesh(new THREE.SphereGeometry(0.095, 12, 8), MAT.pole);
    beater.position.copy(toScene(drum.x, backY + 0.05, drum.z));
    group.add(beater);
    addRod(group, { x: drum.x, y: backY + 0.2, z: 0.08 }, { x: drum.x, y: backY + 0.05, z: drum.z - 0.12 }, 0.018);
  }

  function addSnareStand(group, drum) {
    const bottomZ = drum.z - drum.height / 2;
    addTripodStand(group, drum.x, drum.y, bottomZ, 0.46);
    for (const angle of [Math.PI / 6, Math.PI * 0.83, Math.PI * 1.5]) {
      addRod(
        group,
        { x: drum.x, y: drum.y, z: bottomZ + 0.04 },
        {
          x: drum.x + Math.cos(angle) * drum.diameter * 0.36,
          y: drum.y + Math.sin(angle) * drum.diameter * 0.36,
          z: bottomZ + 0.14,
        },
        0.019,
      );
    }
  }

  function addFloorTomLegs(group, drum) {
    const bottomZ = drum.z - drum.height / 2;
    const radius = drum.diameter / 2;
    for (const angle of [Math.PI * 0.12, Math.PI * 0.86, Math.PI * 1.5]) {
      const attach = {
        x: drum.x + Math.cos(angle) * radius * 0.72,
        y: drum.y + Math.sin(angle) * radius * 0.72,
        z: bottomZ + 0.26,
      };
      const foot = {
        x: drum.x + Math.cos(angle) * radius * 1.12,
        y: drum.y + Math.sin(angle) * radius * 1.12,
        z: 0.035,
      };
      addRod(group, attach, foot, 0.026);
      addRoundFoot(group, foot.x, foot.y, 0.1);
    }
  }

  function addRackTomMount(group, drum) {
    const bottomZ = drum.z - drum.height / 2;
    const post = { x: 0.05, y: 0.18, z: 1.9 };
    addRod(group, { x: 0.05, y: 0.18, z: 1.28 }, post, 0.032);
    addRod(group, post, { x: drum.x, y: drum.y, z: bottomZ + 0.08 }, 0.028);
  }

  function addHiHatHardware(group, drum) {
    addTripodStand(group, drum.x, drum.y, drum.z - 0.04, 0.48);
    const pedal = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.04, 0.58), MAT.pole);
    pedal.position.copy(toScene(drum.x, drum.y + 0.55, 0.05));
    group.add(pedal);
    addRod(group, { x: drum.x, y: drum.y + 0.28, z: 0.06 }, { x: drum.x, y: drum.y, z: 0.28 }, 0.014);
  }

  function rebuildRoom() {
    disposeGroup(roomGroup);
    const { width, length, height } = state.room;

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(width, length), MAT.floor);
    floor.rotation.x = -Math.PI / 2;
    roomGroup.add(floor);

    const gridPts = [];
    for (let x = Math.ceil(-width / 2); x <= Math.floor(width / 2); x += 1) {
      gridPts.push(x, 0, -length / 2, x, 0, length / 2);
    }
    for (let z = Math.ceil(-length / 2); z <= Math.floor(length / 2); z += 1) {
      gridPts.push(-width / 2, 0, z, width / 2, 0, z);
    }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridPts, 3));
    const grid = new THREE.LineSegments(gridGeo, new THREE.LineBasicMaterial({ color: 0xb6b9be }));
    grid.position.y = 0.01;
    grid.userData.ownMaterial = true;
    roomGroup.add(grid);

    const box = new THREE.BoxGeometry(width, height, length);
    const faces = new THREE.Mesh(
      box,
      new THREE.MeshBasicMaterial({
        color: 0x8090a8,
        transparent: true,
        opacity: 0.04,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    );
    faces.position.y = height / 2;
    faces.userData.ownMaterial = true;
    roomGroup.add(faces);

    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(box), new THREE.LineBasicMaterial({ color: 0x55585e }));
    edges.position.y = height / 2;
    edges.userData.ownMaterial = true;
    roomGroup.add(edges);

    const tri = new THREE.Shape();
    tri.moveTo(-0.5, 0);
    tri.lineTo(0.5, 0);
    tri.lineTo(0, -0.7);
    tri.closePath();
    const chevron = new THREE.Mesh(new THREE.ShapeGeometry(tri), new THREE.MeshBasicMaterial({ color: 0x55585e }));
    chevron.rotation.x = -Math.PI / 2;
    chevron.position.copy(toScene(0, -length / 2 + 0.9, 0.02));
    chevron.userData.ownMaterial = true;
    roomGroup.add(pick(chevron, 'Front of room'));

    if (state.options.cables) {
      const sb = stageBoxPos(state);
      const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.8), MAT.box);
      boxMesh.position.copy(toScene(sb.x, sb.y, 0.18));
      roomGroup.add(pick(boxMesh, 'Stage box'));
    }
  }

  function rebuildKit() {
    disposeGroup(kitGroup);
    for (const drum of state.kit) {
      const radius = drum.diameter / 2;
      if (drum.type === 'kick') {
        const shell = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, drum.height, 28), MAT.shell);
        shell.rotation.x = Math.PI / 2;
        shell.position.copy(toScene(drum.x, drum.y, drum.z));
        kitGroup.add(pick(shell, `${drum.name} · ${Math.round(drum.diameter * 12)}"×${Math.round(drum.height * 12)}"`));
        const head = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.98, 28), MAT.head);
        head.position.copy(toScene(drum.x, drum.y - drum.height / 2 - 0.01, drum.z));
        kitGroup.add(head);
        addKickHardware(kitGroup, drum);
      } else if (drum.type === 'drum') {
        const shell = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, drum.height, 28), MAT.shell);
        shell.position.copy(toScene(drum.x, drum.y, drum.z));
        kitGroup.add(pick(shell, `${drum.name} · ${Math.round(drum.diameter * 12)}"×${Math.round(drum.height * 12)}"`));
        const head = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.98, 28), MAT.head);
        head.rotation.x = -Math.PI / 2;
        head.position.copy(toScene(drum.x, drum.y, drum.z + drum.height / 2 + 0.01));
        kitGroup.add(head);
        if (drum.id === 'snare') addSnareStand(kitGroup, drum);
        else if (drum.id === 'tom-lo') addFloorTomLegs(kitGroup, drum);
        else if (drum.id === 'tom-hi') addRackTomMount(kitGroup, drum);
        else if (drum.z - drum.height / 2 > 0.35) addTripodStand(kitGroup, drum.x, drum.y, drum.z - drum.height / 2);
      } else if (drum.type === 'cymbal') {
        const disk = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.025, 28), MAT.cymbal);
        disk.position.copy(toScene(drum.x, drum.y, drum.z));
        disk.rotation.z = 0.12;
        kitGroup.add(pick(disk, `${drum.name} · ${Math.round(drum.diameter * 12)}"`));
        const bell = new THREE.Mesh(
          new THREE.SphereGeometry(radius * 0.16, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
          MAT.cymbal,
        );
        bell.position.copy(toScene(drum.x, drum.y, drum.z + 0.02));
        kitGroup.add(bell);
        if (drum.id === 'hihat') addHiHatHardware(kitGroup, drum);
        else addTripodStand(kitGroup, drum.x, drum.y, drum.z - 0.02, 0.58);
        if (drum.id === 'hihat') {
          const bottom = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.97, radius * 0.97, 0.025, 28), MAT.cymbal);
          bottom.position.copy(toScene(drum.x, drum.y, drum.z - 0.12));
          kitGroup.add(bottom);
        }
      }
    }
  }

  function buildMicMesh(micType, selected) {
    const group = new THREE.Group();
    const body = selected ? MAT.micSel : MAT.micBody;
    const grille = selected ? MAT.grilleSel : MAT.grille;

    if (micType === 'pencil') {
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.42, 12), body);
      group.add(tube);
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.03, 0.07, 12), grille);
      tip.position.y = 0.245;
      group.add(tip);
      group.userData.rear = 0.21;
    } else if (micType === 'ldc') {
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.26, 16), body);
      tube.position.y = -0.06;
      group.add(tube);
      const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.085, 0.15, 16), grille);
      basket.position.y = 0.145;
      group.add(basket);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), grille);
      dome.position.y = 0.22;
      group.add(dome);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.012, 8, 24), MAT.pole);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.06;
      group.add(ring);
      group.userData.rear = 0.19;
    } else if (micType === 'kickmic') {
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.075, 0.16, 14), body);
      tube.position.y = -0.08;
      group.add(tube);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.095, 16, 12), grille);
      bulb.scale.set(1, 1.15, 1);
      bulb.position.y = 0.06;
      group.add(bulb);
      group.userData.rear = 0.16;
    } else {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.048, 0.2, 12), body);
      handle.position.y = -0.05;
      group.add(handle);
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.042, 0.05, 12), body);
      neck.position.y = 0.075;
      group.add(neck);
      const head = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.052, 0.08, 12), grille);
      head.position.y = 0.14;
      group.add(head);
      group.userData.rear = 0.15;
    }
    return group;
  }

  function rebuildMics() {
    disposeGroup(micsGroup);
    disposeGroup(cableGroup);
    const up = new THREE.Vector3(0, 1, 0);

    state.mics.forEach((mic, index) => {
      const selected = index === selectedMicIndex;
      const pos = toScene(mic.x, mic.y, mic.z);
      const dir = micDirection(mic);
      const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);

      if (mic.stand) {
        const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, mic.z, 8), MAT.pole);
        stand.position.copy(toScene(mic.x, mic.y, mic.z / 2));
        micsGroup.add(stand);
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.04, 12), MAT.pole);
        base.position.copy(toScene(mic.x, mic.y, 0.02));
        micsGroup.add(base);
      }

      const bodyGroup = buildMicMesh(mic.micType, selected);
      bodyGroup.position.copy(pos);
      bodyGroup.quaternion.copy(quat);
      bodyGroup.children.forEach((child) => pick(child, `CH ${mic.channel} · ${mic.name} · ${mic.pattern}`, { micIndex: index }));
      micsGroup.add(bodyGroup);

      if (selected && state.options.measurementRays && findDrumByName(mic.target)) {
        const drum = findDrumByName(mic.target);
        const lineGeo = new THREE.BufferGeometry().setFromPoints([pos, toScene(drum.x, drum.y, drum.z)]);
        const line = new THREE.Line(lineGeo, MAT.measure);
        line.computeLineDistances();
        micsGroup.add(line);
      }

      if (state.options.cables) {
        const points = cableRoutePoints(state, mic).map((point, pointIndex) => {
          if (pointIndex === 0) {
            const rear = bodyGroup.userData.rear || 0.15;
            return pos.clone().add(dir.clone().multiplyScalar(-rear - 0.02));
          }
          return toScene(point.x, point.y, point.z);
        });
        const curve = new THREE.CatmullRomCurve3(points);
        const cable = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.016, 6), MAT.cable);
        cableGroup.add(cable);
      }
    });
  }

  function rebuildGobos() {
    disposeGroup(goboGroup);

    state.gobos.forEach((gobo, index) => {
      const group = new THREE.Group();
      const thickness = 0.3;
      const selected = index === selectedGoboIndex;

      const frame = new THREE.Mesh(new THREE.BoxGeometry(gobo.w, gobo.h, thickness), selected ? MAT.micSel : MAT.wood);
      frame.position.y = gobo.h / 2 + 0.15;
      group.add(pick(frame, `${gobo.name} · ${gobo.w}'×${gobo.h}'`, { goboIndex: index }));

      for (const side of [1, -1]) {
        const face = new THREE.Mesh(new THREE.PlaneGeometry(gobo.w * 0.9, gobo.h * 0.9), MAT.fabric);
        face.position.set(0, gobo.h / 2 + 0.15, side * (thickness / 2 + 0.005));
        if (side < 0) face.rotation.y = Math.PI;
        group.add(face);
      }

      for (const footX of [-gobo.w / 2 + 0.4, gobo.w / 2 - 0.4]) {
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 1.2), MAT.wood);
        foot.position.set(footX, 0.075, 0);
        group.add(foot);
      }

      group.position.copy(toScene(gobo.x, gobo.y, 0));
      group.rotation.y = THREE.MathUtils.degToRad(gobo.rot);
      goboGroup.add(group);
    });
  }

  function applyView() {
    if (!state?.options.topView) {
      controls.enableRotate = true;
      controls.maxPolarAngle = Math.PI * 0.52;
      return;
    }
    const span = Math.max(state.room.width, state.room.length);
    camera.position.set(0, Math.max(24, span * 1.8), 0.001);
    controls.target.set(0, 0, 0);
    controls.enableRotate = false;
  }

  function renderScene() {
    if (!state) return;
    pickables = [];
    rebuildRoom();
    rebuildKit();
    rebuildMics();
    rebuildGobos();
    applyView();
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function rayHit(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(pickables, false);
    return hits.length ? hits[0].object : null;
  }

  renderer.domElement.addEventListener('pointermove', (event) => {
    const hit = rayHit(event);
    if (hit) {
      tooltip.textContent = hit.userData.label;
      tooltip.style.display = 'block';
      const rect = viewport.getBoundingClientRect();
      tooltip.style.left = `${event.clientX - rect.left}px`;
      tooltip.style.top = `${event.clientY - rect.top}px`;
      renderer.domElement.style.cursor =
        hit.userData.micIndex !== undefined || hit.userData.goboIndex !== undefined ? 'pointer' : 'default';
    } else {
      tooltip.style.display = 'none';
      renderer.domElement.style.cursor = 'default';
    }
  });
  renderer.domElement.addEventListener('pointerleave', () => {
    tooltip.style.display = 'none';
  });
  renderer.domElement.addEventListener('pointerdown', (event) => {
    downPos = [event.clientX, event.clientY];
  });
  renderer.domElement.addEventListener('pointerup', (event) => {
    if (!downPos) return;
    const moved = Math.hypot(event.clientX - downPos[0], event.clientY - downPos[1]);
    downPos = null;
    if (moved > 5) return;
    const hit = rayHit(event);
    if (hit?.userData.micIndex !== undefined) {
      selectedMicIndex = hit.userData.micIndex;
      onMicSelect?.(selectedMicIndex);
      renderScene();
    } else if (hit?.userData.goboIndex !== undefined) {
      selectedGoboIndex = hit.userData.goboIndex;
      onGoboSelect?.(selectedGoboIndex);
      renderScene();
    }
  });

  function resize() {
    const { clientWidth, clientHeight } = viewport;
    if (!clientWidth || !clientHeight) return;
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight, false);
  }

  function animate() {
    resize();
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  resize();
  animate();

  return {
    setState(nextState) {
      state = nextState;
      selectedMicIndex = Math.min(selectedMicIndex, Math.max(0, state.mics.length - 1));
      selectedGoboIndex = Math.min(selectedGoboIndex, Math.max(0, state.gobos.length - 1));
      renderScene();
    },
    setSelectedMicIndex(index) {
      selectedMicIndex = index;
      renderScene();
    },
    setSelectedGoboIndex(index) {
      selectedGoboIndex = index;
      renderScene();
    },
    capturePng() {
      renderer.render(scene, camera);
      return renderer.domElement.toDataURL('image/png');
    },
    resetOrbitView() {
      state.options.topView = false;
      camera.position.set(16, 14, 22);
      controls.target.set(0, 2.5, 0);
      controls.enableRotate = true;
      renderScene();
    },
  };
}
