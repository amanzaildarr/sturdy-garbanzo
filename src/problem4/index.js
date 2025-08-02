function sum_to_n_a(n) {
	if (n <= 1) return n;
	return n + sum_to_n_c(n - 1);
}

function sum_to_n_b(n) {
	let result = (n * (n + 1)) / 2;
	return result;

}

function sum_to_n_c(n) {
	let sum = 0;
	for (let i = 1; i <= n; i++) {
		sum += i;
	}
	return sum;
}

const n = 22; // Example input
console.log(`Sum of numbers from 1 to ${n} using different methods:`);
const resultA = sum_to_n_a(n); // 55
const resultB = sum_to_n_b(n); // 15
const resultC = sum_to_n_c(n); // 15

console.log(`Result A: ${resultA}`);
console.log(`Result B: ${resultB}`);
console.log(`Result C: ${resultC}`);