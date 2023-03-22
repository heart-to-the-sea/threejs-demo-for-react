// 纹理
// uniform sampler2D u_texture;
uniform float u_time;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_position;

varying float v_displacement;

	// Bump Mapping Unparametrized Surfaces on the GPU by Morten S. Mikkelsen
	// https://mmikk.github.io/papers3d/mm_sfgrad_bump.pdf
// dFdx表示计算导数
vec3 perturbNormalArb(vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection) {

    vec3 vSigmaX = dFdx(surf_pos.xyz);
    vec3 vSigmaY = dFdy(surf_pos.xyz);
    vec3 vN = surf_norm; // normalized

    vec3 R1 = cross(vSigmaY, vN);
    vec3 R2 = cross(vN, vSigmaX);

    float fDet = dot(vSigmaX, R1) * faceDirection;

    vec3 vGrad = sign(fDet) * (dHdxy.x * R1 + dHdxy.y * R2);
    return normalize(abs(fDet) * surf_norm - vGrad);

}
