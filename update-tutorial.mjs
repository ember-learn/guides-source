import { execa } from 'execa';

const versionShas = {
  'v4.6.0': 'c9a8fe0dc4b48f91ccc163879073b6bfc83efcda',
  'v4.7.0': 'c9a8fe0dc4b48f91ccc163879073b6bfc83efcda',
  'v4.8.0': 'c9a8fe0dc4b48f91ccc163879073b6bfc83efcda',
  'v4.9.0': 'c9a8fe0dc4b48f91ccc163879073b6bfc83efcda',
  'v4.10.0': '5655a0253e3f4d8f547fe28d22a88dec798dda3a',
  'v4.11.0': '6906bcfff75f51e4a8c6d5244e3378de07d4961c',
  'v4.12.0': '4d418bff6f43bdc0b7d5ae0d82e8daa54453c508',
  'v5.0.0': '8fd3d47b362c03cf45e94aa7e1dade61b9893151',
  'v5.1.0': '94126485fcad2933325b66ced0b9f7b5b5f4911d',
  'v5.2.0': '5accb2e7e1a95ad64fc89c126068e2adbbd5b14e',
  'v5.3.0': 'db073816ad373993cf3505a701f26e3c9c47ac2d',
  'v5.4.0': '3a459944b20d7070830f5ab5f3de92a443dc3883',
  'v5.5.0': 'a7aec376ea0b77c51196540c4d21a1e39e287754',
};

for (let version in versionShas) {
  console.log(`Fixing version ${version}`);
  const sha = versionShas[version];
  await execa('git', ['checkout', sha], {
    cwd: '/Users/mansona/temp/guides-source-temp-tutorial',
    stdio: 'inherit',
  });
  await execa('rm', ['-rf', `./guides/${version}/tutorial`], {
    stdio: 'inherit',
  });
  await execa(
    'cp',
    [
      '-r',
      `/Users/mansona/temp/guides-source-temp-tutorial/guides/release/tutorial`,
      `./guides/${version}/tutorial`,
    ],
    { stdio: 'inherit' }
  );

  let emberDataVersion = version.replace(/^v/, '');

  if (['5.4.0', '5.5.0'].includes(emberDataVersion)) {
    emberDataVersion = '5.3.0';
  }

  await execa(
    'node',
    [
      './scripts/update-version-links',
      `guides/${version}`,
      version.replace(/^v/, ''),
      emberDataVersion,
    ],
    { stdio: 'inherit' }
  );

  await execa('git', ['commit', '-a', '-m', `Fix version ${version}`], {
    stdio: 'inherit',
  });
}
