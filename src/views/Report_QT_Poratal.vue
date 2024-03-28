<template>
	<main id="report_cs_scsv-page">
		<h1>Report QT Portal : ALL (ReCheck)</h1>
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
				<tbody v-else-if="tableHeaders.length=0">
					<tr>
                        <td  style="text-align: center;" :colspan="tableHeaders.length">Not Data..</td>
					</tr>

				</tbody>
                <tbody v-else>
					<tr>
                        <td  style="text-align: center;" :colspan="tableHeaders.length">Loading...</td>
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
			responseData_check: null,
			responseData_all: null,
			currentPage: 1,
			itemsPerPage: 50,
			tableHeaders: [
            "qt_no",
            "time_in",
            "status_new_cus",
            "status_cs",
            "so_no",
            "status_inv",
            "inv_no",
            "status_receipt",
            "recript_no",
            "remark"

			],
			Year_Data:new Date().getFullYear(),
			Month_Data:new Date().getMonth()+1,
			Date_Data:new Date().getDate(),
			nextpage: nextpage,
			backpage: backpage,
			DownloadFile:DownloadFile
		};
	},
	mounted() {
		this.getData_Check();
		this.getData_All();
		
	},
	methods: {
		async getData_Check() {
			try {
				const response = await fetch('http://203.154.39.190:443/costsheet/inet/map-qt_poatal-check', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				});
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				const data_check = await response.json();
				this.responseData_check = data_check;
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		},async getData_All() {
			try {
				const response = await fetch('http://203.154.39.190:443/costsheet/inet/map-qt_poatal', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				});
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				const data_all = await response.json();
				this.responseData_all = data_all;
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
			if (!this.responseData_check) return;
			const wb = XLSX.utils.book_new();
			const ws = XLSX.utils.json_to_sheet(this.responseData_check);
			const ws_all = XLSX.utils.json_to_sheet(this.responseData_all);
			
			XLSX.utils.book_append_sheet(wb, ws, "Data_ReCheck");
			XLSX.utils.book_append_sheet(wb, ws_all, "Data_ALL");
			

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
			link.download = 'Data_QT_Portal_'+this.Date_Data+this.Month_Data+this.Year_Data+'.xlsx';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}

	},
	computed: {
		paginatedData() {
			const startIndex = (this.currentPage - 1) * this.itemsPerPage;
			const endIndex = startIndex + this.itemsPerPage;
			return this.responseData_check ? this.responseData_check.slice(startIndex, endIndex) : null;
		},
		totalPages() {
			return this.responseData_check ? Math.ceil(this.responseData_check.length / this.itemsPerPage) : 0;
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
