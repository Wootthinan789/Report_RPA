<template>
	<main id="about-page">
		<h1>Report</h1>
		<div style="text-align: right;">
			<button class="download-button" @click="downloadData">
			<img :src="DownloadFile" alt="Download File" style="width: 30px; height: 30px;"/>
			</button>
        </div>
		<div style="margin-top: 10px;">
			<table>
				<thead>
					<tr class="table-container">
						<th v-for="header in tableHeaders" :key="header" class="center">{{ header }}</th>
					</tr>
				</thead>
				<tbody v-if="paginatedData" class="data-text">
					<tr v-for="(item, index) in paginatedData" :key="index">
						<td v-for="(value, key) in item" :key="key" class="center">{{ value }}</td>
					</tr>
				</tbody>
				<tbody v-else>
					<tr>
						<td style="text-align: center;" :colspan="tableHeaders.length">Loading...</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="pagination" style="font-size: 12px;">
			<button @click="previousPage" :disabled="currentPage === 1"><img :src="backpage" alt="back page" style="width: 25px; height: 25px;"/></button>
			<span>Page : </span>
			<input type="number" v-model.number="currentPage" min="1" :max="totalPages" class="page-input">
			<span>of {{ totalPages }}</span>
			<button @click="nextPage" :disabled="currentPage === totalPages"><img :src="nextpage" alt="next page" style="width: 25px; height: 25px;"/></button>
		</div>
	</main>
</template>

<script>
import DownloadFile from '../assets/web.png'
import nextpage from '../assets/next.png'
import backpage from '../assets/back.png'
import * as XLSX from 'xlsx';
export default {
	data() {
		return {
			responseData: null,
			currentPage: 1,
			itemsPerPage: 35,
			tableHeaders: [
				"Time In",
				"Costsheet",
				"SO No",
				"Job Status",
				"Remark SO",
				"GI No",
				"SC No",
				"SV No",
				"Remark SCSV",
				"Check SV Query",
				"SV Created By"
			],
			nextpage: nextpage,
			backpage: backpage,
			DownloadFile:DownloadFile
		};
	},
	mounted() {
		this.getData();
		
	},
	methods: {
		async getData() {
			try {
				const response = await fetch('http://203.154.39.190:443/costsheet/inet/map-cs-sv', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				});
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				const data = await response.json();
				this.responseData = data;
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		},
		async previousPage() {
			if (this.currentPage > 1) {
				this.currentPage--;
			}
		},
		async nextPage() {
			if (this.currentPage < this.totalPages) {
				this.currentPage++;
			}
		},
		async downloadData() {
			if (!this.responseData) return;

			const ws = XLSX.utils.json_to_sheet(this.responseData);
			const wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, "Data");

			// Generate XLSX file
			const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

			function s2ab(s) {
				const buf = new ArrayBuffer(s.length);
				const view = new Uint8Array(buf);
				for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
				return buf;
			}

			const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

			// Trigger download
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = 'Data_costsheet.xlsx';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}

	},
	computed: {
		paginatedData() {
			const startIndex = (this.currentPage - 1) * this.itemsPerPage;
			const endIndex = startIndex + this.itemsPerPage;
			return this.responseData ? this.responseData.slice(startIndex, endIndex) : null;
		},
		totalPages() {
			return this.responseData ? Math.ceil(this.responseData.length / this.itemsPerPage) : 0;
		}
	}
};
</script>

<style>
#about-page {
	margin: 0 auto;
	max-width: auto;
}
.download-button {
		top: 5%;
		right: 3%;
		position: fixed;
        float: right; /* Float the button to the right */
        margin-right: 10px; /* Add some margin for spacing */
    }
.data-text {
	text-align: center;
	font-size: 12px;
}
.table-container {
	font-size: 14px;
	overflow-x: auto;
}
table {
	width: 100%;
	border-collapse: collapse;
}
thead th {
	background-color: #d2d2d2;
}
.pagination {
	margin-top: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.pagination button {
	margin: 0 5px;
}
.page-input {
	margin: 5px;
	width: 50px;
	text-align: center;
}
</style>
